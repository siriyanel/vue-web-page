<template>
  <main class="mt-3">
    <div class="container">
      <h2 class="text-center">제품 수정</h2>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">제품명</label>
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="productDetail.product_name">
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">제품가격</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model="productDetail.product_price">
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">배송비</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model="productDetail.delivery_price">
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">추가배송비(도서산간)</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model="productDetail.add_delivery_price">
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">제품카테고리</label>
        <div class="col-md-9">
          <div class="row">
            <div class="col-auto">
              <select class="form-select">
                <option>전자제품</option>
              </select>
            </div>
            <div class="col-auto">
              <select class="form-select">
                <option>컴퓨터</option>
              </select>
            </div>
            <div class="col-auto">
              <select class="form-select">
                <option>악세사리</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">태그</label>
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="productDetail.tags">
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label">출고일</label>
        <div class="col-md-9">
          <div class="input-group mb-3">
            <input type="number" class="form-control" v-model="productDetail.outbound_days">
            <span class="input-group-text">일 이내 출고</span>
          </div>
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col-6 d-grid p-1">
          <button type="button" class="btn btn-lg btn-dark" @click="goToList">취소하기</button>
        </div>
        <div class="col-6 d-grid p-1">
          <button type="button" class="btn btn-lg btn-danger" @click="productInsert">저장하기</button>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  data() {
    return {
      productId: 0,
      productDetail: {
          product_name: '',
          product_price: 0,
          delivery_price: 0,
          add_delivery_price: 0,
          tags: '',
          outbound_days: 0,
          category_id:1,
          seller_id:1
        }
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    if(this.user.email == undefined) {
      alert("로그인을 해야 이용할 수 있습니다.");
      this.$router.push({path:'/'}); 
    }
  },
  created() {
    this.productId = this.$route.query.product_id;
    this.getProductDetail();
  },
  methods: {
    goToList(){
      this.$router.push({path:'/sales'}); 
    },
    async getProductDetail() {
      let productDetail = await this.$api("/api/productList3",{param:[this.productId]});
      if(productDetail.length > 0) {
        this.productDetail = productDetail[0];
      }
    },
    productInsert(){
      if(this.productDetail.product_name == ""){
        // return this.$swal("제품이름은 필수값 입니다.");
      }

      if(this.productDetail.product_price == "" || this.productDetail.product_price == 0){
        // return this.$swal("제품가격은 필수값 입니다.");
      }

      if(this.productDetail.delivery_price == "" || this.productDetail.delivery_price == 0){
        // return this.$swal("배송비는 필수값 입니다.");
      }

      if(this.productDetail.outbound_days == "" || this.productDetail.outbound_days == 0){
        // return this.$swal("출고일은 필수값 입니다.");
      }

      // this.productDetail.category_id = this.categoryList.filter(c =>{
      //   return (c.category1 == this.cate1 && c.category2 == this.cate2 && c.category3 == this.cate3);
      // })[0].id;
      // console.log(this.product.category_id);

      this.$swal.fire({
        title: '정말 업데이트 하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '업데이트',
        cancelButtonText: '취소'
        }).then(async (result) => {
        if(result.isConfirmed) {
        await this.$api("/api/productUpdate",{param:[this.productDetail, this.productId]});
        this.$swal.fire('업데이트되었습니다!','','success');
        this.$router.push({path:'/sales'});
        }
      });
    }
  }
}
</script>