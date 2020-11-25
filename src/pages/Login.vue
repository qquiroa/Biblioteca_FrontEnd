<template>
  <q-page class="flex flex-center container">
    <div>
      <q-card class="flex-center flex" style="width:30vw; height: 70vh">
      <q-card-section>
        <div class="text-h4">Iniciar sesión</div class="text-h6">
      </q-card-section>
      <q-card-section>
        <q-form @submit="tryLogin">
          <q-input 
          :rules="[ val => val && val.length > 0 || 'Ingrese nombre de usuario.']" color="teal" 
          filled v-model="user" label="Usuario" style="width:25vw">
            <template v-slot:prepend>
              <q-icon name="account_box" />
            </template>
          </q-input>
          <q-input 
          :rules="[ val => val && val.length > 0 || 'Ingrese contraseña.']" color="teal" 
          filled v-model="pwd" label="Contraseña" style="width:25vw">
            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
          </q-input>
          <center class="q-pt-md">
            <q-btn label="Entrar" type="submit" color="black" :loading="loginLoad"/>
          </center>
        </q-form>
        <center class="q-pt-md">
            <q-btn label="Registrate" to="/Register" color="black"/>
          </center>
      </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageLogin",
  data(){
    return{
      user: null,
      pwd: null,
      loginLoad: false
    }
  },
  methods: {
    tryLogin(){
      if(!this.loginLoad){
        this.loginLoad = true
        this.$graphql.query(`
          query {
            allCountries {
              edges {
                node {
                  name
                }
              }
            }
          }`, {}, (req, res) => {
  if(res.status === 401) {
    this.loginLoad = false
    throw new Error('Not authorized')
  }
})
.then(body => {
  console.log(body.data)
  this.loginLoad = false
})
.catch(err => {
  console.log(err.message)
  this.loginLoad = false
})
      }
    },
    close_popup(){
      this.dialog.active = false
    }
  }
};
</script>

<style scoped>
  .container{
    background-image: url("https://img.chilango.com/2020/06/biblioteca-monsi-1280x600.jpeg");
  }
</style>