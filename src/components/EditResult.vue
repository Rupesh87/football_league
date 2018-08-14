<template>
  <div id = 'edit_result'>
   <br>
    <div class="d-flex justify-content-center">
      <h3>Edit Result</h3>
    </div><br><br>
    <form role="form" @submit.prevent="updateResult">
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="selectFirst">Home</label>
          <input type="text" class="form-control"  v-model="home_team" :disabled= true required>
          <!-- <select v-model="home_team" class="form-control" required>
            <option value="" hidden>Select Home Team</option>
            <option v-for="team in home_team_array" v-bind:key="team.name" :disabled= true>{{team.name}}</option>
          </select> -->
        </div>
        <div class="form-group col-md-6">
          <label for="selectSecong">Away</label>
          <input type="text" class="form-control"  v-model="away_team" :disabled= true required>
          <!-- <select v-model="away_team"  class="form-control" required>
            <option value="" hidden>Select Away Team</option>
            <option v-for="team in away_team_array" v-bind:key="team.name" :disabled= true>{{team.name}}</option>
          </select> -->
        </div>
      </div>
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="selectFirstScore">Home Team Score</label>
          <input type="number" class="form-control" min="0" max="20" v-model="home_team_score" required>
        </div>
        <div class="form-group col-md-6">
          <label for="selectFirstScore">Away Team Score</label>
          <input type="number" class="form-control"  min="0" max="20" v-model="away_team_score" required>
        </div>
      </div>
      <div class="form-row align-items-center">
        <div class="form-group col-md-6">
          <label for="inputdate">Date</label>
          <input type="date" class="form-control" v-model="date" required>
        </div>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Update</button>
        <router-link to='/' class="btn btn-danger">Cancel</router-link>
      </div>
    </form>
  </div>
</template>
<script>

import db from './firebaseInit'
export default {
  name: 'edit_result',
  data () {
    return {
      home_team: null,
      away_team: null,
      home_team_score: null,
      away_team_score: null,
      date: null,
      home_team_array: [],
      away_team_array: [], 
      store_home_team: null,
      store_away_team: null,
      store_home_score: null,
      store_away_score: null
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
        this.home_team_array.push(data)
        this.away_team_array.push(data)
      })
    })
  },
  beforeRouteEnter (to, from, next) {
    db.collection('results').doc(to.params.id).get().then((doc) => {
      next(vm => {
        vm.home_team_score = doc.data().home_team_score
        vm.home_team = doc.data().home_team_name
        vm.away_team = doc.data().away_team_name
        vm.away_team_score = doc.data().away_team_score
        vm.date = doc.data().date,
        vm.store_home_score = doc.data().home_team_score
        vm.store_home_team = doc.data().home_team_name
        vm.store_away_team = doc.data().away_team_name
        vm.store_away_score = doc.data().away_team_score
      })
    })
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      db.collection('results').doc(this.$route.params.id).get().then(function(doc) {
        if (doc.exists) {
          this.home_team_score = doc.data().home_team_score
          this.home_team = doc.data().home_team_name
          this.away_team = doc.data().away_team_name
          this.away_team_score = doc.data().away_team_score
          this.date = doc.data().date
        } else {
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    },
    updateResult () {
      const previous_home_team_doc = this.findId(this.home_team_array, this.store_home_team)
      const previous_away_team_doc = this.findId(this.away_team_array, this.store_away_team)
      const updated_previous_home_team_doc = this.previousPointCount(previous_home_team_doc, this.checkPreviousStatus(this.store_home_score, this.store_away_score).home_team);
      const updated_previous_away_team_doc = this.previousPointCount(previous_away_team_doc, this.checkPreviousStatus(this.store_home_score, this.store_away_score).away_team);

      db.collection('teams').doc(previous_home_team_doc.id).set(updated_previous_home_team_doc);
      db.collection('teams').doc(previous_away_team_doc.id).set(updated_previous_away_team_doc);

      db.collection('results').doc(this.$route.params.id).set({
        home_team_name: this.home_team,
        away_team_name: this.away_team,
        home_team_score: this.home_team_score,
        away_team_score: this.away_team_score,
        date: this.date
      });

      const home_team_doc = this.findId(this.home_team_array, this.home_team)
      const away_team_doc = this.findId(this.away_team_array, this.away_team)
      const updated_home_team_doc = this.pointCount(updated_previous_home_team_doc, this.checkStatus().home_team);
      const updated_away_team_doc = this.pointCount(updated_previous_away_team_doc, this.checkStatus().away_team);
      
      db.collection('teams').doc(home_team_doc.id).set(updated_home_team_doc);
      db.collection('teams').doc(away_team_doc.id).set(updated_away_team_doc);
       this.$router.push('/')
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
    previousPointCount(doc, status) {
      if(status === 'win') {
        const document = {
          'name': doc.name,
          'pld': doc.pld - 1,
          'pts': doc.pts - 3,
          'win': doc.win - 1,
          'loss': doc.loss + 0,
          'draw': doc.draw + 0
        }
        return document;
      } else if(status === 'draw') { 
        const document = {
          'name': doc.name,
          'pld': doc.pld - 1,
          'pts': doc.pts - 1,
          'win': doc.win + 0,
          'loss': doc.loss + 0,
          'draw': doc.draw - 1
        }
        return document;
      } else {
        const document = {
          'name': doc.name,
          'pld': doc.pld - 1,
          'pts': doc.pts + 0,
          'win': doc.win + 0,
          'loss': doc.loss - 1,
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
    },
     checkPreviousStatus(home_score, away_score) {
      if(home_score > away_score) {
        return {home_team: 'win', away_team: 'loss'}
      } else if (home_score  === away_score) {
        return { home_team: 'draw', away_team: 'draw'}
      } else {
        return { home_team: 'loss', away_team: 'win'}
      }
    }
  }
}
</script>
