package com.hicode.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        logger.error("JwtAuthenticationEntryPoint: Responding with unauthorized error. Message: '{}', Path: {}", authException.getMessage(), request.getServletPath());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        String message = authException.getMessage() != null ? authException.getMessage().replace("\"", "\\\"") : "Authentication Failed";
        String path = request.getServletPath().replace("\"", "\\\"");

        String jsonResponse = String.format("{\"timestamp\": \"%s\", \"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\", \"path\": \"%s\"}",
                java.time.Instant.now().toString(),
                HttpServletResponse.SC_UNAUTHORIZED,
                message,
                path);
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
}