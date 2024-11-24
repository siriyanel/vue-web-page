<template>
<main class="mt-3">
  <div class="container">
    <div class="row mb-2">
      <div class="col-14">
        <select class="form-select">
          <option selected></option>
          <option value="1">노트북</option>
          <option value="2">모니터</option>
          <option value="3">마우스/키보드</option>
        </select>
      </div>
    </div>   
    <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6" :key="i" v-for="(product,i) in productList">
          <div class="card" style="width: 18rem;">
            <a @click="goToDetail(product.id);" style="cursor:pointer;"><img :src="`/download/${product.id}/${product.path}`" class="card-img-top" alt="..."></a>
            <div class="card-body">
              <h5 class="card-title">{{product.product_name}}</h5>
              <p class="card-text">
                <span class="badge bg-dark text-white me-1">{{product.category1}}</span>
                <span class="badge bg-dark text-white me-1">{{product.category2}}</span>
                <span class="badge bg-dark text-white">{{product.category3}}</span>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="addToCart(product.id)">장바구니 담기</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">주문하기</button>
                </div>
                <small class="text-dark">{{product.product_price}}원</small>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div> 
</main>
</template>
<script>
export default {
  data() {
    return {
      productList: []
    };
  },
  created() {
    this.getProductList(); //함수 실행
  },
  methods: {
    async getProductList() {
      this.productList = await this.$api("/api/productList",{}); //sql query 동작
      console.log(this.productList);  //리스트 확인
    },
    goToDetail(product_id) {
      this.$router.push({path:'/detail', query:{product_id: product_id}});
    },
    async addToCart(productId) {
    const userId = this.$store.state.user.id; 
    if (!userId) {
        console.error('User ID is undefined. User may not be logged in.');
        return;
    }
    
    const quantity = 1; 

    try {
        const response = await this.$api('/addToCart', { user_id: userId, product_id: productId, quantity });
        
        // API 응답 형식 확인
        console.log('Add to cart response:', response);
        
        // 응답에서 data 속성 확인
        if (response && response.data) {
            console.log('Data:', response.data);
            this.$swal.fire('Success!', 'Item added to cart!', 'success');
        } else {
            console.error('Unexpected response format:', response);
            this.$swal.fire('Error!', 'Failed to add item to cart.', 'error');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        this.$swal.fire('Error!', 'Failed to add item to cart.', 'error');
    }
}

  }
};
</script>