package com.example.kakaotalk.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

public class JwtUtil {
    private static final long expiredTime = 1000 * 60L * 60L * 3L;
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //jwt 토큰 생성
    public static String jwtUtil(String contact) {
        Date now = new Date();
        Claims claims = Jwts.claims().setSubject(contact);
        String token = Jwts.builder()
                .setClaims(claims)
                .signWith(key)
                .setExpiration(new Date(now.getTime() + expiredTime))
                .compact();
        return token;
    }

    //jwt 토큰 유효성 체크
    public static boolean jwtCheck(String jwtToken) {
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwtToken);
            Date expirationDate = claimsJws.getBody().getExpiration();
            long expirationTime = expirationDate.getTime(); // 밀리초 단위로 변환
            long currentTime = System.currentTimeMillis(); // 현재 시간을 밀리초 단위로 가져옴
            return expirationTime > currentTime;
        } catch (Exception e) {
            return false;
        }
    }
    
    //jwt 토큰에 있는 유저 정보 식별
    public static String jwtUser(String jwtToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
        String useContact = claims.getSubject();
        return useContact;
    }
}
