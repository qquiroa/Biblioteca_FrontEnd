
const routes = [
  {
    path: '/',
    component: () => import('layouts/noLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: 'Register', component: () => import('pages/Register.vue') },
      { path: 'Loan', component: () => import('pages/Loan.vue') },
      { path: 'ActiveLoans', component: () => import('pages/Active-Loans.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
