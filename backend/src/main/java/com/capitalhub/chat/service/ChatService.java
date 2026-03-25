package com.capitalhub.chat.service;

import com.capitalhub.chat.dto.ChatRequest;
import com.capitalhub.chat.dto.ChatResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class ChatService {

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

    @Value("${anthropic.api-key:}")
    private String apiKey;

    @Value("${anthropic.model:claude-sonnet-4-20250514}")
    private String model;

    @Value("${anthropic.max-tokens:1024}")
    private int maxTokens;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String TRAINING_SYSTEM_PROMPT = """
            Eres el Asesor de Formacion de CapitalHub, una plataforma de formacion y empleo para comerciales.

            Tu objetivo es ayudar al usuario a elegir la ruta formativa que mejor se adapte a su perfil y objetivos.

            Rutas disponibles:

            1. COMERCIAL PRO - Conviertete en un profesional de ventas de alto rendimiento:
               - Appointment Setter: Cualificacion de prospectos y agendar llamadas de venta con decisores
               - Closer High Ticket: Cierre de ventas de alto valor por telefono, frameworks de cierre, manejo de objeciones
               - Cold Caller: Conversaciones comerciales por telefono frio, estructura de llamada, apertura y cualificacion

            2. META ADS - Publicidad digital en Meta:
               - Meta Ads: Lanzar, optimizar y escalar campanas de pago en Meta Ads, segmentacion, creativos y metricas

            Haz preguntas para entender:
            - Experiencia previa del usuario
            - Si prefiere trato directo con personas o trabajo mas analitico/digital
            - Sus objetivos profesionales (freelance, empleo, emprendimiento)
            - Disponibilidad de tiempo

            Responde SIEMPRE en espanol. Se conciso pero amable. Usa un tono profesional pero cercano.
            No uses emojis excesivos. Limita tus respuestas a 2-3 parrafos maximo.
            """;

    private static final String MARKETPLACE_SYSTEM_PROMPT = """
            Eres el Asistente del Marketplace de CapitalHub, una plataforma que conecta comerciales con empresas.

            Tu objetivo es guiar al usuario en el uso de la plataforma y darle consejos para destacar.

            Funcionalidades del Marketplace:
            - OFERTAS: Las empresas publican ofertas de trabajo. El usuario puede filtrar por tipo de rol,
              modalidad (remoto/presencial), sector y rango salarial.
            - APLICACIONES: El usuario puede aplicar a ofertas. Puede ver el estado de sus aplicaciones
              (pendiente, en revision, aceptada, rechazada).
            - PERFIL: El usuario tiene un perfil profesional con bio, experiencia, habilidades y portfolio.
              Un buen perfil aumenta las posibilidades de ser seleccionado.
            - FILTROS: Se pueden guardar busquedas y activar alertas para nuevas ofertas.

            Consejos que puedes dar:
            - Como mejorar el perfil para destacar
            - Como escribir una buena carta de presentacion al aplicar
            - Que tipo de ofertas buscar segun la experiencia
            - Como preparar entrevistas comerciales

            Responde SIEMPRE en espanol. Se conciso pero amable. Usa un tono profesional pero cercano.
            No uses emojis excesivos. Limita tus respuestas a 2-3 parrafos maximo.
            """;

    public ChatResponse chat(ChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            return ChatResponse.builder()
                    .content("El asistente de IA no esta disponible en este momento. Contacta con soporte si necesitas ayuda.")
                    .context(request.getContext())
                    .tokensUsed(0)
                    .build();
        }

        String systemPrompt = "training".equals(request.getContext())
                ? TRAINING_SYSTEM_PROMPT
                : MARKETPLACE_SYSTEM_PROMPT;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            List<Map<String, String>> messages = new ArrayList<>();
            for (ChatRequest.Message msg : request.getMessages()) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("max_tokens", maxTokens);
            body.put("system", systemPrompt);
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    ANTHROPIC_API_URL, HttpMethod.POST, entity, Map.class);

            Map responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("Empty response from Anthropic API");
            }

            // Extract content from response
            List<Map<String, Object>> contentBlocks = (List<Map<String, Object>>) responseBody.get("content");
            String content = "";
            if (contentBlocks != null && !contentBlocks.isEmpty()) {
                content = (String) contentBlocks.get(0).get("text");
            }

            // Extract token usage
            Map<String, Object> usage = (Map<String, Object>) responseBody.get("usage");
            int tokensUsed = 0;
            if (usage != null) {
                Object input = usage.get("input_tokens");
                Object output = usage.get("output_tokens");
                tokensUsed = ((Number) input).intValue() + ((Number) output).intValue();
            }

            return ChatResponse.builder()
                    .content(content)
                    .context(request.getContext())
                    .tokensUsed(tokensUsed)
                    .build();

        } catch (Exception e) {
            log.error("Error calling Anthropic API: {}", e.getMessage(), e);
            return ChatResponse.builder()
                    .content("Lo siento, ha ocurrido un error al procesar tu mensaje. Intentalo de nuevo.")
                    .context(request.getContext())
                    .tokensUsed(0)
                    .build();
        }
    }
}
