package com.nexura.userproduct.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class StockReduceRequest {
    private List<StockItem> items;

    public StockReduceRequest() {}

    public StockReduceRequest(List<StockItem> items) {
        this.items = items;
    }

    public List<StockItem> getItems() {
        return items;
    }

    public void setItems(List<StockItem> items) {
        this.items = items;
    }

    public static class StockItem {
        @JsonProperty("product_id")
        private Long productId;

        private Integer quantity;

        public StockItem() {}

        public StockItem(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

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
    }
}
