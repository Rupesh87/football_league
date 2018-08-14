<template>
  <div id = 'result'>
    <br>
    <div class="float-right">
      <router-link to="/add" class="btn btn-secondary">Add Result</router-link>
      <router-link to="/league" class="btn btn-secondary">League Table</router-link>
    </div><br><br>
    <div v-for="date in dates" v-bind:key="date">
      <p class="text-left font-weight-bold">{{date}}</p>
      <div class="list-group">
        <router-link v-bind:to="{ name: 'edit-result', params: { id: result.id }}" class="list-group-item list-group-item-action" v-for="result in results_array" v-bind:key="result" v-if="result.date == date">
          <div v-if="result.home_team_score > result.away_team_score" class="row">
            <div class="col-5 text-left"><b class="text-success">{{result.home_team_name}} </b><span class="badge badge-success">{{result.home_team_score}}</span></div>
            <div class="col-2 text-center">vs</div>
            <div class="col-5 text-right"><span class="badge badge-secondary">{{result.away_team_score}}</span> {{result.away_team_name}}</div>
          </div>
          <div class="row" v-else-if="result.home_team_score === result.away_team_score">
            <div class="col-5 text-left">{{result.home_team_name}} <span class="badge badge-secondary">{{result.home_team_score}}</span></div>
            <div class="col-2 text-center">vs</div>
            <div class="col-5 text-right"><span class="badge badge-secondary">{{result.away_team_score}}</span> {{result.away_team_name}}</div>
          </div>
          <div class="row" v-else>
            <div class="col-5 text-left">{{result.home_team_name}} <span class="badge badge-secondary">{{result.home_team_score}}</span></div>
            <div class="col-2 text-center">vs</div>
            <div class="col-5 text-right"><span class="badge badge-success">{{result.away_team_score}}</span><b class="text-success"> {{result.away_team_name}}</b></div>
          </div>
        </router-link>
        <br><br>
      </div>
    </div>
    <!-- <p>
      <button @click="prevPage">Previous</button>
      <button @click="nextPage">Next</button>
    </p> -->
  </div>
</template>
<script>
import db from './firebaseInit'

export default {
  name: 'result',
  data () {
    return {
      results_array: [],
      dates: [],
      // pageSize:3,
      // currentPage:1
    }
  },
  created () {
    db.collection('results').get().then(querySnapshot => {
      querySnapshot.forEach(element => {
        const value = {
          id: element.id,
          'home_team_name': element.data().home_team_name,
          'home_team_score': element.data().home_team_score,
          'away_team_name': element.data().away_team_name,
          'away_team_score': element.data().away_team_score,
          'date': element.data().date
        }
        if(this.dates.indexOf(element.data().date) === -1)
         this.dates.push(element.data().date)
        // array list of dates sorted by desc order
        this.dates.sort((a,b)=> {
          return new Date(b) - new Date(a);
        })
        this.results_array.push(value);
      })
     })
  }
}
</script>
