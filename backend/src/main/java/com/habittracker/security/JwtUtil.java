package com.habittracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    //TODO: as stated in secret key string, it should be done via SSL, but for the sake of development speed, we will use a string for now
    private static final String SECRET_KEY = "either-path-to-file-containing-string-(less work-BUT-HARAM)-OR-via-generated-SSL-key-pairs-(HALAL)";

    //TODO: should be kept in a secure location, not in the code
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generate Access Token
    public String generateAccessToken(UUID userId, String role, UUID tokenVersion) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("role", role)
                .claim("tokenVersion", tokenVersion.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract all claims from the token
    public Claims extractAllClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract individual claims using extractAllClaims
    public UUID extractUserId(String token) {
        return UUID.fromString(extractAllClaims(token).getSubject());
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public UUID extractTokenVersion(String token) {
        return UUID.fromString(extractAllClaims(token).get("tokenVersion", String.class));
    }
}

