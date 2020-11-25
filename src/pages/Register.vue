<template>
  <q-page class="flex flex-center container">
    <div>
      <q-card class="flex-center flex" style="width:30vw; height: 70vh">
      <q-card-section>
        <div class="text-h4">Registrarse</div class="text-h6">
      </q-card-section>
      <q-card-section>
        <q-form @submit="tryRegister">
            <q-input 
          :rules="[ val => val && val.length > 0 || 'Ingrese su nombre.']" color="teal" 
          filled v-model="name" label="Nombre" style="width:25vw">
            <template v-slot:prepend>
              <q-icon name="list_alt" />
            </template>
          </q-input>
          <q-input 
          :rules="[ val => val && val.length > 0 || 'Ingrese su apellido.']" color="teal" 
          filled v-model="last_name" label="Apellido" style="width:25vw">
            <template v-slot:prepend>
              <q-icon name="list_alt" />
            </template>
          </q-input>
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
            <q-btn label="Registrate" type="submit" color="black" :loading="registerLoad"/>
          </center>
        </q-form>
      </q-card-section>
    </q-card>
    </div>
    <Dialog :active="dialog.active" :title="dialog.title" :body="dialog.body" :icon="dialog.icon" :color="dialog.color" :close="close_popup"/>
  </q-page>
</template>

<script>
import Dialog from "./Dialog"
export default {
    components: {
    Dialog
},
  name: "PageLogin",
  data(){
    return{
      user: null,
      pwd: null,
      name: null,
      last_name: null,
      registerLoad: false,
      dialog: {
        active: false,
        title: "",
        body: "",
        icon: "",
        color: ""
      }
    }
  },
  methods: {
      async tryRegister(){
        if (!this.registerLoad) {
            this.registerLoad = true
            //VARIABLES DECLARED IF REQUIRED
            const variables = {
                name: this.name,
                user: this.user,
                pwd: this.pwd
            }
            //GRAPHQL QUERY TO BE EXECUTED
            const query = `
            mutation createUserClient($name: String!, $user: String!, $pwd: String!) {
                createUserClient(name: $name, username: $user, password: $pwd){
                    user{
                        id
                        username
                    }
                }
            }`
            const data = await this.$graphql(query, variables)
            console.log(data)
            if (data.message == 'OK' && data.data ) {
                if (data.data.createUserClient) { //IF BRINGS DATA
                    this.dialog.title = "Completado"
                    this.dialog.body = "El usuario se ha creado correctamente."
                    this.dialog.icon = "check_box"
                    this.dialog.color = "green"
                    this.dialog.active = true
                } else { //IF IS NULL FOR SOME SERVER ERROR
                    this.dialog.title = "Error"
                    this.dialog.body = "El usuario no se ha podido crear, intentelo nuevamente."
                    this.dialog.icon = "error"
                    this.dialog.color = "red"
                    this.dialog.active = true
                }
            } else if (data.message == 'ERROR' || data.data == undefined) {
                this.dialog.title = "Error"
                    this.dialog.body = "El usuario no se ha podido crear, intentelo nuevamente (SERV)."
                    this.dialog.icon = "error"
                    this.dialog.color = "red"
                    this.dialog.active = true
            }
            this.registerLoad = false
        }
    },
    close_popup(){
      this.dialog.active = false
    }
  },
};
</script>

<style scoped>
  .container{
    background-image: url("https://img.chilango.com/2020/06/biblioteca-monsi-1280x600.jpeg");
  }
</style>