package com.nexura.ordercart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderStatusRequest {
    private String status;

    @JsonProperty("payment_status")
    private String paymentStatus;

    public OrderStatusRequest() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
