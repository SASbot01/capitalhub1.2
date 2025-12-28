package com.capitalhub.auth.service;

import com.capitalhub.auth.entity.User;
import com.capitalhub.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor; // Asegúrate de tener lombok o haz el constructor manual

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; // 👇 Inyectamos el servicio de email

    @Value("${FRONTEND_URL:https://capitalhub.es}")
    private String frontendUrl;

    public void processForgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();

            // Guardar token en BBDD (asumiendo que tienes el campo resetToken en User)
            user.setResetToken(token);
            userRepository.save(user);

            // Crear link
            String resetLink = frontendUrl + "/reset-password?token=" + token;

            // 👇 ENVÍO REAL DE CORREO
            String subject = "Recuperación de contraseña - CapitalHub";
            String body = "Hola " + user.getFirstName() + ",\n\n" +
                    "Has solicitado restablecer tu contraseña.\n" +
                    "Haz clic en el siguiente enlace para continuar:\n" +
                    resetLink + "\n\n" +
                    "Si no fuiste tú, ignora este mensaje.";

            emailService.sendSimpleMessage(email, subject, body);
        } else {
            // Por seguridad, no decimos si el usuario existe o no, pero puedes loguearlo
            System.out.println("⚠️ Solicitud de pass para email no existente: " + email);
        }
    }

    public void resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null); // Invalidar token
            userRepository.save(user);
        } else {
            throw new RuntimeException("Token inválido o expirado");
        }
    }
}
