package com.nexura.ordercart.repository;

import com.nexura.ordercart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByOrderStatus(String orderStatus);

    long countByOrderStatusIn(Collection<String> orderStatuses);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.orderStatus <> 'Cancelled'")
    Double sumTotalRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
