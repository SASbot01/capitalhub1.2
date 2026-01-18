package com.capitalhub;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CapitalHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(CapitalHubApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("🔑 HASH GENERADO PARA 'test123': " + passwordEncoder.encode("test123"));
            System.out.println("🔑 HASH GENERADO PARA 'company123': " + passwordEncoder.encode("company123"));
        };
    }
}