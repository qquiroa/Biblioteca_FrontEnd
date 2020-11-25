<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="height: 90vh; width: 65vw">
      <div class="row">
        <div class="col">
          <q-btn
            flat
            class="full-width"
            label="Activos"
            @click="panel = 'active'"
            :color="panel == 'active' ? 'primary' : 'black'"
          />
        </div>
        <div class="col">
          <q-btn
            flat
            class="full-width"
            label="Finalizados"
            @click="panel = 'done'"
            :color="panel == 'done' ? 'primary' : 'black'"
          />
        </div>
      </div>
      <q-tab-panels v-model="panel">
        <q-tab-panel name="active" style="height: 63vh;">
            <div
        v-if="loans[0].length == 0"
        class="flex flex-center"
        style="height: 50vh;"
      >
        No préstamos activos
      </div>
          <div
            class="row q-pa-md"
            v-for="(loan_row, index) in loans"
            v-bind:key="index"
          >
            <q-card
              class="my-card"
              v-for="(loan, index1) in loan_row"
              v-bind:key="index1"
              style="width:20vw; height: 38vh;"
            >
              <q-card-section>
                <div class="text-h5">{{ loan.book.title }}</div>
                <q-separator />
                <div class="text-h6">Prestado a:</div>
                <div class="text-subtitle1">
                  {{
                    loan.userClient.firstName +
                      " " +
                      loan.userClient.lastName +
                      " - " +
                      loan.userClient.username
                  }}
                </div>
                <br />
                <div class="text-h6">
                  Ejemplares prestados: {{ loan.quantity }}
                </div>
                <br />
                <div class="text-h6">Fecha de préstamo:</div>
                <div class="text-subtitle">{{ loan.startDate }}</div>
                <br />
                <div class="text-h6">Fecha de devolución:</div>
                <div class="text-subtitle">{{ loan.finishDate }}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  label="Finalizar"
                  flat
                  color="green"
                  @click="set_done(loan.id, loan.book.id, loan.quantity)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-tab-panel>

        <q-tab-panel name="done" style="height: 63vh;">
            <div
        v-if="done[0].length == 0"
        class="flex flex-center"
        style="height: 50vh;"
      >
        No préstamos finalizados
      </div>
          <div
            class="row q-pa-md"
            v-for="(loan_row, index) in done"
            v-bind:key="index"
          >
            <q-card
              class="my-card"
              v-for="(loan, index1) in loan_row"
              v-bind:key="index1"
              style="width:20vw; height: 40vh;"
            >
              <q-card-section>
                <div class="text-h5">{{ loan.book.title }}</div>
                <q-separator />
                <div class="text-h6">Prestado a:</div>
                <div class="text-subtitle1">
                  {{
                    loan.userClient.firstName +
                      " " +
                      loan.userClient.lastName +
                      " - " +
                      loan.userClient.username
                  }}
                </div>
                <br />
                <div class="text-h6">
                  Ejemplares prestados: {{ loan.quantity }}
                </div>
                <br />
                <div class="text-h6">Fecha de préstamo:</div>
                <div class="text-subtitle">{{ loan.startDate }}</div>
                <br />
                <div class="text-h6">Fecha de devolución:</div>
                <div class="text-subtitle">{{ loan.finishDate }}</div>
                <br />
                <div class="text-h6">Fecha de entrega:</div>
                <div class="text-subtitle">{{ loan.doneDate }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-tab-panel>
      </q-tab-panels>
        <q-btn label="regresar" flat color="primary" to="/Loan"/>
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
  data() {
    return {
      loans: [],
      done: [],
      panel: "active",
      dialog: {
        active: false,
        title: "",
        body: "",
        icon: "",
        color: ""
      }
    };
  },
  methods: {
    date(date) {
      const format_date = new Date(date);
      const week_day = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
      ];
      const month = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
      ];
      const result =
        week_day[format_date.getDay()] +
        ", " +
        format_date.getDate() +
        " de " +
        month[format_date.getMonth()] +
        " del " +
        format_date.getFullYear();
      return result;
    },
    to_str(str, node) {
      var decoded = decodeURIComponent(escape(window.atob(str)));
      return parseInt(decoded.replace(node + "Node:", ""));
    },
    async set_done(id, id_book, quantity) {
      const query = `
        mutation doneLoan ($id: String!, $book: String!, $quantity: String!) {
                doneLoan(id: $id, book: $book, quantity: $quantity){
                    loan{
                        id
                    }
                }
            }
        `,
        variables = {
          id: id.toString(),
          book: id_book,
          quantity: quantity
        },
        data = await this.$graphql(query, variables);
      if (data.message == "OK" && data.data) {
        if (data.data.doneLoan) {
          //IF BRINGS DATA
          this.dialog.title = "Completado";
          this.dialog.body = "El préstamo se ha concluido correctamente.";
          this.dialog.icon = "check_box";
          this.dialog.color = "green";
          this.dialog.active = true;
          location.reload();
        } else {
          //IF IS NULL FOR SOME SERVER ERROR
          this.dialog.title = "Error";
          this.dialog.body =
            "El préstamo no se ha podido concluir, intentelo nuevamente.";
          this.dialog.icon = "error";
          this.dialog.color = "red";
          this.dialog.active = true;
        }
      } else if (data.message == "ERROR" || data.data == undefined) {
        this.dialog.title = "Error";
        this.dialog.body =
          "El préstamo no se ha podido concluir, intentelo nuevamente (SERV).";
        this.dialog.icon = "error";
        this.dialog.color = "red";
        this.dialog.active = true;
      }
    },
    close_popup(){
      this.dialog.active = false
    }
  },
  async created() {
    const query = `
        query {
            allLoans {
                edges {
                    node {
                        id
                        book {
                            id
                            title
                            description
                            author {
                                name
                            }
                        }
                        startDate
                        finishDate
                        doneDate
                        quantity
                        userClient {
                            firstName
                            lastName
                            username
                        }
                        active
                    }
                }
            }
        }
        `,
      data = await this.$graphql(query, {});
    if (data.message == "OK" && data.data) {
      if (data.data.allLoans) {
        //IF BRINGS DATA
        const loans = data.data.allLoans.edges;
        var temp_arr = [],
          cont = 0;
        loans.forEach(loan => {
          if (loan.node.active) {
            loan.node.id = this.to_str(loan.node.id, "Loan");
            loan.node.book.id = this.to_str(loan.node.book.id, "Book");
            loan.node.startDate = this.date(loan.node.startDate);
            loan.node.finishDate = this.date(loan.node.finishDate);
            if (cont == 3) {
              this.loans.push(temp_arr);
              temp_arr = [loan.node];
              cont = 0;
            } else {
              temp_arr.push(loan.node);
            }
            cont++;
          }
        });
        this.loans.push(temp_arr);
        cont = 0;
        temp_arr = [];
        loans.forEach(loan => {
          if (!loan.node.active) {
            loan.node.id = this.to_str(loan.node.id, "Loan");
            loan.node.book.id = this.to_str(loan.node.book.id, "Book");
            loan.node.startDate = this.date(loan.node.startDate);
            loan.node.finishDate = this.date(loan.node.finishDate);
            loan.node.doneDate = this.date(loan.node.doneDate)
            if (cont == 3) {
              this.done.push(temp_arr);
              temp_arr = [loan.node];
              cont = 0;
            } else {
              temp_arr.push(loan.node);
            }
            cont++;
          }
        });
        this.done.push(temp_arr);
        console.log(this.loans, this.done);
      } else {
        //IF IS NULL FOR SOME SERVER ERROR
        this.dialog.title = "Error";
        this.dialog.body =
          "El préstamo no se ha podido realizar, intentelo nuevamente.";
        this.dialog.icon = "error";
        this.dialog.color = "red";
        this.dialog.active = true;
      }
    } else if (data.message == "ERROR" || data.data == undefined) {
      this.dialog.title = "Error";
      this.dialog.body =
        "El préstamo no se ha podido realizar, intentelo nuevamente (SERV).";
      this.dialog.icon = "error";
      this.dialog.color = "red";
      this.dialog.active = true;
    }
  }
};
</script>
