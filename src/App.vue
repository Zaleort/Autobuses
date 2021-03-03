<template>
  <div class="container">
    <header class="header">
      <h1 class="logo" routerLink="/">
        Autobuses
      </h1>
      <nav class="nav">
        <router-link class="nav-link" to="/nucleos">
          Núcleos Urbanos
        </router-link>
        <router-link class="nav-link" to="/lineas">
          Líneas
        </router-link>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>
