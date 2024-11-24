<template>
  <main class="mt-3">
    <div class="container">
      <div class="mb-3">
        <select v-model="searchType" class="form-select" aria-label="Search Type">
          <option value="name">제품명으로 검색</option>
          <option value="price">가격으로 검색</option>
        </select>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="검색어 입력..."
          class="form-control"
        />
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th></th>
            <th>제품명</th>
            <th>제품가격</th>
            <th>배송비</th>
            <th>추가 배송비</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr :key="i" v-for="(product, i) in filteredProducts">
            <td>
              <img v-if="product.path != null" :src="`/download/${product.id}/${product.path}`" style="height:50px;width:auto;" />
            </td>
            <td>{{ product.product_name }}</td>
            <td>{{ product.product_price }}</td>
            <td>{{ product.delivery_price }}</td>
            <td>{{ product.add_delivery_price }}</td>
            <td>
              <button type="button" class="btn btn-info me-1" @click="goToImageInsert(product.id);">사진등록</button>
              <button type="button" class="btn btn-warning me-1" @click="goToUpdate(product.id);">수정</button>
              <button type="button" class="btn btn-danger" @click="deleteProduct(product.id);">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ProductSearch',
  data() {
    return {
      productList: [],
      searchTerm: this.$route.query.term || '',
      searchType: 'name' // New data property to track search type
    };
  },
  created() {
    this.getProductList();
  },
  watch: {
    '$route.query.term': {
      immediate: true,
      handler(newTerm) {
        this.searchTerm = newTerm || '';
      }
    }
  },
  computed: {
    filteredProducts() {
      return this.productList.filter(product => {
        if (this.searchType === 'name') {
          return product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase());
        } else if (this.searchType === 'price') {
          return product.product_price.toString().includes(this.searchTerm);
        }
        return false; // Fallback if neither condition is met
      });
    }
  },
  methods: {
    async getProductList() {
      this.productList = await this.$api("/api/productList2", {});
      console.log(this.productList);
    },
    // Other methods remain unchanged
  }
}
</script>
