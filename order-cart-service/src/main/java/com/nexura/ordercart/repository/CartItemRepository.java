package com.nexura.ordercart.repository;

import com.nexura.ordercart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}
