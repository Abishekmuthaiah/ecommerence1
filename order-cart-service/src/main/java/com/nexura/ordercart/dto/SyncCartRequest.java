package com.nexura.ordercart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class SyncCartRequest {
    @JsonProperty("user_id")
    private Long userId;

    private List<SyncCartItem> items;

    public SyncCartRequest() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<SyncCartItem> getItems() {
        return items;
    }

    public void setItems(List<SyncCartItem> items) {
        this.items = items;
    }

    public static class SyncCartItem {
        @JsonProperty("product_id")
        private Long productId;

        private Integer quantity;
        private Double price;

        @JsonProperty("product_name")
        private String productName;

        @JsonProperty("product_image")
        private String productImage;

        public SyncCartItem() {}

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductImage() {
            return productImage;
        }

        public void setProductImage(String productImage) {
            this.productImage = productImage;
        }
    }
}
