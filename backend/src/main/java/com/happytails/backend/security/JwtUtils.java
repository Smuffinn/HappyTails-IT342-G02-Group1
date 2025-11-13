package com.happytails.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtils {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        // Support either a raw secret string or a Base64-encoded secret.
        // Try to decode as Base64 first (this lets you store a compact base64 key in APP_JWT_SECRET).
        try {
            byte[] keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException ex) {
            // Not a valid Base64 string — fall back to using UTF-8 bytes of the provided secret.
            return Keys.hmacShaKeyFor(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }

    public String generateJwtToken(String username, java.util.List<String> roles) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        io.jsonwebtoken.JwtBuilder builder = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512);

        if (roles != null && !roles.isEmpty()) {
            builder.claim("roles", roles);
        }

        return builder.compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().verifyWith((SecretKey) getSigningKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    @SuppressWarnings("unchecked")
    public java.util.List<String> getRolesFromJwtToken(String token) {
        try {
            io.jsonwebtoken.Claims claims = Jwts.parser().verifyWith((SecretKey) getSigningKey()).build()
                    .parseSignedClaims(token).getPayload();
            Object rolesObj = claims.get("roles");
            if (rolesObj instanceof java.util.List) {
                return (java.util.List<String>) rolesObj;
            }
        } catch (JwtException | IllegalArgumentException e) {
            // ignore and return empty
        }
        return java.util.Collections.emptyList();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
