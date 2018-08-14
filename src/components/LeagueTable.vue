<template>
  <div id = 'league-table'>
    <br>
    <div class="float-right">
      <router-link to="/" class="btn btn-secondary">Back To Home</router-link>
    </div><br><br>
    <table class="table">
        <thead class="thead-light">
            <tr>
            <th scope="col">Pos</th>
            <th scope="col">Team</th>
            <th scope="col">Pld</th>
            <th scope="col">W</th>
            <th scope="col">L</th>
            <th scope="col">D</th>
            <th scope="col">Pts</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(data, index) in league_datas" v-bind:key="data" :index="index" :data="data">
                <th scope="row">{{index + 1}}</th>
                <td>{{data.team}}</td>
                <td>{{data.pld}}</td>
                <td>{{data.w}}</td>
                <td>{{data.l}}</td>
                <td>{{data.d}}</td>
                <td>{{data.pts}}</td>
            </tr>
        </tbody>
    </table>
    <!-- <p>
      <button @click="prevPage">Previous</button>
      <button @click="nextPage">Next</button>
    </p> -->
  </div>
</template>
<script>
import db from './firebaseInit'

export default {
  name: 'league-table',
  data () {
    return {
      league_datas: [],
      // pageSize:3,
      // currentPage:1
    }
  },
  created () {
    db.collection('teams').get().then(querySnapshot => {
      querySnapshot.forEach(element => {
        const value = {
          id:  element.data().id,
          'team': element.data().name,
          'pld': element.data().pld,
          'w': element.data().win,
          'l': element.data().loss,
          'd': element.data().draw,
          'pts': element.data().pts
        }
        this.league_datas.push(value);
      // array list of team sorted by desc order
      this.league_datas.sort((a,b)=> {
        return b.pts > a.pts
      })
      })
     })
  }
}
</script>
