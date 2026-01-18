package com.capitalhub.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("info@capitalhub.es"); // Tu correo remitente
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("✅ Correo enviado a: " + to);
        } catch (Exception e) {
            System.err.println("❌ Error enviando correo: " + e.getMessage());
            e.printStackTrace();
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
}
