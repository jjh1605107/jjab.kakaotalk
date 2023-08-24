package com.example.kakaotalk;

import com.example.kakaotalk.utils.CryptoUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class KakaoTalkApplicationTests {
    @Test
    void contextLoads() {
        String test = "abcd1234!";
        System.out.println(CryptoUtil.hashSha512(test));
    }
}
