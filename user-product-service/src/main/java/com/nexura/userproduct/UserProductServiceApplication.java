package com.nexura.userproduct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserProductServiceApplication {
    public static void main(String[] args) {
        // Ensure database directory exists
        java.io.File dbDir = new java.io.File("../database");
        if (!dbDir.exists()) {
            dbDir.mkdirs();
        }
        SpringApplication.run(UserProductServiceApplication.class, args);
    }
}
