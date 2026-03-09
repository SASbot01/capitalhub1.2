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

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("info@capitalhub.es");
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
                "y empezar a acceder a toda la formacion.\n\n" +
                "Haz clic en el siguiente enlace para completar tu registro:\n\n" +
                registerUrl + "\n\n" +
                "Este enlace es personal e intransferible.\n\n" +
                "Un saludo,\nEl equipo de CapitalHub";
        sendSimpleMessage(to, subject, body);
    }
}
