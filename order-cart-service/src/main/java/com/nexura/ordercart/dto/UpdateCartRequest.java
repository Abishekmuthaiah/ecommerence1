package com.nexura.ordercart.dto;

public class UpdateCartRequest {
    private Integer quantity;

    public UpdateCartRequest() {}

    public UpdateCartRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
