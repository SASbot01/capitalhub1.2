package com.capitalhub.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:adrian@capitalhubapp.com}")
    private String fromEmail;

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Correo enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando correo a {}: {}", to, e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name) {
        String subject = "¡Bienvenido a CapitalHub!";
        String body = "Hola " + name + ",\n\n" +
                "¡Bienvenido a CapitalHub! Estamos encantados de tenerte con nosotros.\n" +
                "Ya puedes empezar a explorar la plataforma y gestionar tus operaciones.\n\n" +
                "Un saludo,\nEl equipo de CapitalHub";
        sendSimpleMessage(to, subject, body);
    }

    public void sendRegistrationEmail(String to, String token) {
        String registerUrl = frontendUrl + "/register?plan=trial&token=" + token;

        String subject = "CapitalHub - Completa tu registro";
        String body = "¡Hola!\n\n" +
                "Hemos recibido tu pago correctamente. Ya puedes crear tu cuenta en CapitalHub " +
                "y empezar a acceder a toda la formación.\n\n" +
                "Haz clic en el siguiente enlace para completar tu registro:\n\n" +
                registerUrl + "\n\n" +
                "Este enlace es personal e intransferible.\n\n" +
                "Un saludo,\nEl equipo de CapitalHub";
        sendSimpleMessage(to, subject, body);
    }

    /**
     * Send custom welcome email with credentials (used by admin bulk-create)
     */
    public void sendCustomWelcomeEmail(String to, String password) {
        String loginUrl = "https://capitalhub.es/login";
        String discordUrl = "https://discord.gg/kWKtHSBr";

        String body = "¡Bienvenido a Capital Hub!\n\n" +
                "Soy Adrián y a partir de ahora vamos a trabajar juntos para que aprendas una profesión digital y consigas tu primer trabajo remoto.\n\n" +
                "Antes de nada, aquí tienes todo lo que necesitas para arrancar:\n\n" +
                "1. Tu acceso a la plataforma\n" +
                "Entra aquí: " + loginUrl + "\n" +
                "Usuario: " + to + "\n" +
                "Contraseña: " + password + "\n\n" +
                "2. Únete a la comunidad de Discord\n" +
                "Entra aquí: " + discordUrl + "\n" +
                "Lo primero que tienes que hacer es grabarte un vídeo de 30 segundos presentándote y subirlo en el canal #presentaciones. " +
                "Di tu nombre, de dónde eres, qué ruta vas a hacer, y cuál es tu objetivo en 6 meses.\n\n" +
                "Tu primer paso dentro de la plataforma es elegir tu ruta (Comercial, Marketing o IA) y empezar la primera formación. No lo dejes para mañana.\n\n" +
                "Nos vemos dentro.\n\n" +
                "Adrián Villanueva\n" +
                "Fundador de Capital Hub";

        sendSimpleMessage(to, "¡Bienvenido a Capital Hub!", body);
    }

    /**
     * Send auto-created account credentials to a new user after Stripe payment
     */
    public void sendAutoAccountEmail(String to, String password, String tierName) {
        String loginUrl = frontendUrl + "/login";

        String subject = "CapitalHub - Tu cuenta ha sido creada";
        String body = "¡Hola!\n\n" +
                "Hemos recibido tu pago correctamente y tu cuenta en CapitalHub ya está activa.\n\n" +
                "Aquí tienes tus credenciales de acceso:\n\n" +
                "   Email: " + to + "\n" +
                "   Contraseña: " + password + "\n" +
                "   Plan: " + tierName + "\n\n" +
                "Accede a la plataforma desde aquí:\n" +
                loginUrl + "\n\n" +
                "Te recomendamos cambiar tu contraseña una vez dentro de la plataforma.\n\n" +
                "¡Bienvenido al equipo!\n" +
                "El equipo de CapitalHub";
        sendSimpleMessage(to, subject, body);
    }
}
