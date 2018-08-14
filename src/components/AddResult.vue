<template>
  <div id = 'add_result'>
    <br>
    <div class="d-flex justify-content-center">
      <h3>Add Result</h3>
    </div><br><br>
    <form role="form" @submit.prevent="saveResult">
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="selectFirst">Home</label>
          <select v-model="home_team" class="form-control" required>
            <option value="" hidden>Select Home Team</option>
            <option v-for="team in team_array" v-bind:key="team.name" :disabled="team.name == away_team">{{team.name}}</option>
          </select>
        </div>
        <div class="form-group col-md-6">
          <label for="selectSecong">Away</label>
          <select v-model="away_team"  class="form-control" required>
            <option value="" hidden>Select Away Team</option>
            <option v-for="team in team1_array" v-bind:key="team.name" :disabled="team.name == home_team">{{team.name}}</option>
          </select>
        </div>
      </div>
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="selectFirstScore">Home Team Score</label>
          <input type="number" class="form-control" min="0" max="20" v-model="home_team_score" required>
        </div>
        <div class="form-group col-md-6">
          <label for="selectFirstScore">Away Team Score</label>
          <input type="number" class="form-control" min="0" max="20" v-model="away_team_score" required>
        </div>
      </div>
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="inputdate">Date</label>
          <input type="date" class="form-control" v-model="date" required>
        </div>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Submit</button>
        <router-link to='/' class="btn btn-danger">Cancel</router-link>
      </div>
    </form>
  </div>
</template>
<script>
import db from './firebaseInit'
export default {
  name: 'add_result',
  data () {
    return {
      home_team: '',
      away_team: '',
      home_team_score: '',
      away_team_score: '',
      date: '',
      team_array: [],
      team1_array: []
    }
  },
  created () {
    db.collection('teams').get().then(querySnapshot => {
      querySnapshot.forEach(element => {
        const data = {
          'id': element.id,
          'name': element.data().name,
          'pld': element.data().pld,
          'pts': element.data().pts,
          'win': element.data().win,
          'loss': element.data().loss,
          'draw': element.data().draw
        }
        this.team_array.push(data)
        this.team1_array.push(data)
      })
    })
  },
  methods: {
    saveResult () {
      const home_team_doc = this.findId(this.team_array, this.home_team)
      const away_team_doc = this.findId(this.team1_array, this.away_team)
      const updated_home_team_doc = this.pointCount(home_team_doc, this.checkStatus().home_team);
      const updated_away_team_doc = this.pointCount(away_team_doc, this.checkStatus().away_team);
      db.collection('results').add({
        home_team_name: this.home_team,
        home_team_score: this.home_team_score,
        away_team_name: this.away_team,
        away_team_score: this.away_team_score,
        date: this.date
      })
      .then(docRef => {
         console.log("data added!");
      })
      .catch(error => console.log(error))

      db.collection("teams").doc(home_team_doc.id).set(updated_home_team_doc);
      db.collection("teams").doc(away_team_doc.id).set(updated_away_team_doc);
      this.$router.push('/');
      
    },
    findId(array, team_name) {
      const doc = array.find(function(elem){
        if(elem.name === team_name) {
          return elem;
        }
      });
      return doc
    },
    pointCount(doc, status) {
      if(status === 'win') {
        const document = {
          'name': doc.name,
          'pld': doc.pld + 1,
          'pts': doc.pts + 3,
          'win': doc.win + 1,
          'loss': doc.loss + 0,
          'draw': doc.draw + 0
        }
        return document;
      } else if(status === 'draw') { 
        const document = {
          'name': doc.name,
          'pld': doc.pld + 1,
          'pts': doc.pts + 1,
          'win': doc.win + 0,
          'loss': doc.loss + 0,
          'draw': doc.draw + 1
        }
        return document;
      } else {
        const document = {
          'name': doc.name,
          'pld': doc.pld + 1,
          'pts': doc.pts + 0,
          'win': doc.win + 0,
          'loss': doc.loss + 1,
          'draw': doc.draw + 0
        }
        return document;
      }
    },
    checkStatus() {
      if(this.home_team_score > this.away_team_score) {
        return {home_team: 'win', away_team: 'loss'}
      } else if (this.home_team_score  === this.away_team_score) {
        return { home_team: 'draw', away_team: 'draw'}
      } else {
        return { home_team: 'loss', away_team: 'win'}
      }
    }
  }
}
</script>
