/**
 * es6 modules and imports
 */
// import sayHello from './hello';
//import $ from 'jquery';

// sayHello('World');

/**
 * require style imports
 */

const {getMovies, deleteMovie, patchMovie, getMovie, postMovie} = require('./api.js');
//VARIABLE TO HOLD ALL MOVIES IN JSN DB
var allMovies = [];

//OBJECTS TO ADD AND EDIT MOVIES
var movieEditObject = {};
var movieAddObject = {
  id: 0,
  title:'',
  date:'',
  genre: [],
  description:'',
  rating: 0
};

//VARIABLES FOR SEARCH CRITERIA
var searchTitle;
var searchDate;
var searchRating;
var searchGenre = [];

//CALL FUNCTION TO DISPLAY ALL MOVIES
displayMovies();

//event handler to display loading animations while API is connecting
$(document).ajaxStart(function () {
  $('.spinner').css('display', 'inline-block');
});
//event handler to set display to none to loading animations after the API is already connected
$(document).ajaxComplete(function (requestName) {
  $('.spinner').css('display', 'none');
});


//FUNCTION TO SEARCH MOVIES BASED ON CRITERIA
function searchMovies(){
  let allCards = [];
  //show all cards
  $('.movieCard').show();
  //check if genres has been selected
  let hasGenres = (searchGenre.length > 0);

  allMovies.forEach(function (movie) {

    let compare = searchGenre.some(r => movie.genre.includes(r));

    //if-else statement to compare all possible combinations of search selections
    if(searchTitle && searchRating && searchDate && hasGenres){
        console.log("1 searchTitle && searchRating && searchDate && compare");
        if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
          if(movie.date === searchDate && compare){
            if(searchRating !== '6'){
              if(movie.rating === searchRating){
                allCards.push(movie);
              }
            }else if(searchRating === '6'){
              allCards.push(movie);
            }
          }
        }

    }else if(searchTitle && searchRating && searchDate){
      console.log("2 searchTitle && searchRating && searchDate");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        if(movie.date === searchDate){
          if(searchRating !== '6'){
            if(movie.rating === searchRating){
              allCards.push(movie);
            }
          }else if(searchRating === '6'){
            allCards.push(movie);
          }
        }
      }

    }else if(searchTitle && searchRating && hasGenres){
      console.log("3 searchTitle && searchRating && compare");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        if(searchRating !== '6'){
          if(movie.rating === searchRating && compare){
            allCards.push(movie);
          }
        }else if(searchRating === '6' && compare){
          allCards.push(movie);
        }
      }

    }else if(searchDate && searchRating && hasGenres){
      console.log("4 searchDate && searchRating && compare");

      if(searchRating !== '6' && compare){
          if((movie.rating === searchRating) && (parseFloat(searchDate) === parseFloat(movie.date))){
            allCards.push(movie);
          }
        }else if(searchRating === '6'&& (parseFloat(searchDate) === parseFloat(movie.date)) && compare){
          allCards.push(movie);
        }


    }else if(searchTitle && searchDate && hasGenres){
      console.log("5 searchTitle && searchDate && compare");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        if(parseFloat(searchDate) === parseFloat(movie.date) && compare){
          allCards.push(movie);
        }
      }

    }else if(searchTitle && searchRating){
      console.log("6 searchTitle && searchRating");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        if(searchRating !== '6'){
          if(movie.rating === searchRating){
            allCards.push(movie);
          }
        }else if(searchRating === '6'){
          allCards.push(movie);
        }
      }

    }else if(searchTitle && searchDate){
      console.log("7 searchTitle && searchDate");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        if(parseFloat(searchDate) === parseFloat(movie.date)){
            allCards.push(movie);
        }
      }

    }else if(searchDate && searchRating){
      console.log("8 searchDate && searchRating");

      if(searchRating !== '6'){
          if((movie.rating === searchRating) && (parseFloat(searchDate) === parseFloat(movie.date))){
            allCards.push(movie);
          }
        }else if(searchRating === '6'&& (parseFloat(searchDate) === parseFloat(movie.date))){
          allCards.push(movie);
        }

    }else if(searchRating && hasGenres){
      console.log("9 searchRating && compare === true");

      if(compare){
        if(searchRating !== '6'){
          if(movie.rating === searchRating){
            allCards.push(movie);
          }
        }else if(searchRating === '6'){
          allCards.push(movie);
        }
      }


    }else if(searchTitle){
      console.log("10 searchTitle");

      if((movie.title.substr(0, searchTitle.length).toLowerCase() === searchTitle)){
        allCards.push(movie);
      }

    }else if(searchDate){
      console.log("11 searchDate");

      if(parseFloat(searchDate) === parseFloat(movie.date)){
        allCards.push(movie);
      }

    }else if(searchRating){
      console.log("12 searchRating");

      if(searchRating !== '6'){
          if(movie.rating === searchRating){
            allCards.push(movie);
          }
        }else if(searchRating === '6'){
          allCards.push(movie);
        }

    }else if(hasGenres){
      console.log("13 compare");
      if(compare){
        allCards.push(movie);
      }

    }

  });

  //reset both title and date search criteria after each search
  searchTitle = undefined;
  searchDate = undefined;
  $('#dateSearch').val("");

  //if no criteria met. display message
 if(allCards.length === 0){
   console.log("No movies matched criteria");
   $('.noMatchInfo').show(1000);

   setTimeout(function () {
     $('.noMatchInfo').hide(1000);
   }, 3000);
 }
 else{
   //compare all movies and allCards results for differences
   let results = allMovies.filter(({ id: id1 }) => !allCards.some(({ id: id2 }) => id2 === id1));

   if(results.length > 0){
     results.forEach(function (result) {
       //toggle cards not being used in search criteria
       $(`#card${result.id}`).toggle();
     });
   }

 }

}

//EVENT HANDLER TO CREATE MOVIE EDIT OBJECT
$(document).on('click','.edit_movie', function (e) {
  e.preventDefault();

  let idEdit = $(this).attr('id').substring(4,$(this).attr('id').length);
  // alert(idEdit);
  getMovie(idEdit)
      .then(movie => {
        movieEditObject.id = movie.id;
        movieEditObject.title = movie.title;
        movieEditObject.date = movie.date;
        movieEditObject.genre = movie.genre;
        movieEditObject.rating = movie.rating;
        movieEditObject.description = movie.description;

        $('#movieEditInput').val(movieEditObject.title);
        $('#movieEditDate').val(movieEditObject.date);
        $('#genreMultiSelectEdit').val(movieEditObject.genre);
        //update edit genre tags
        $('#genreListEdit').empty();
        //movieAddObject.genre = [];
        movieEditObject.genre.forEach(genre =>{
          createGenreTag(genre,'genreListEdit');
        });
        // createGenreTag($('#genreMultiSelectE').children('option:selected').val(),'genreListEdit')
        switch (movieEditObject.rating) {
          case "1":
            $('#ratingRadios1e').prop("checked", true);
            break;
          case "2":
            $('#ratingRadios2e').prop("checked", true);
            break;
          case "3":
            $('#ratingRadios3e').prop("checked", true);
            break;
          case "4":
            $('#ratingRadios4e').prop("checked", true);
            break;
          case "5":
            $('#ratingRadios5e').prop("checked", true);
            break;
        }
        $('#movieDescriptionInputEdit').val(movieEditObject.description);
      })
      .catch((error) => console.log("Error looking at the movie." + error));


});

//EVENT HANDLER TO EDIT THE SELECTED MOVIE AND SUBMIT CHANGES
$('#editMovieClick').click(function (e) {

  e.preventDefault();

  let movieDate = $('#movieEditDate').val();
  // let editDate = new Date();
  //     let month, year = new Date;
  // //alert(typeof movieDate.getDate());
  // if(!movieDate){
  //   editDate.setUTCDate(1);
  //   editDate.setUTCMonth(0);
  //   editDate.setUTCFullYear(movieDate.getFullYear());
  // }
  //
  // alert(editDate);



  let editedMovie = {
    title: $('#movieEditInput').val(),
    date: movieDate,
    rating: $('input[name="editRadios"]:checked').val(),
    //genre: movieAddObject.genre,
    description: $('#movieDescriptionInputEdit').val()
    //image: data
  };

  patchMovie(editedMovie, movieEditObject.id)
      .then(() => {
        alert("Movie was edited");
        displayMovies();
      }).catch(error => console.log(`There was an error: ${error}`));

  //$('#editMovieModal').modal('hide');
  $('#editMovieModal').modal('toggle');
});

//CLICK EVENT FOR TITLE SEARCH CRITERIA
$('#searchClick').click(function (e) {
  e.preventDefault();

  searchTitle = $('#searchinput').val().toLowerCase();

  searchMovies();

  $('#searchinput').val("");
  searchTitle = undefined;

});

//CLICK EVENT FOR DATE SEARCH CRITERIA
$('#dateSearchButton').click(function (e) {
  e.preventDefault();

  let input = $('#dateSearch').val();

  if((parseFloat(input) > 1900) && (parseFloat(input) < 2099)){
    searchDate = input;
    searchMovies();
  }else {
    alert("Enter a number between 1900 and 2099");
  }

});

//CLICK EVENT TO GET SEARCH GENRES CRITERIA
$('#genreSearchButton').click(function (e) {
  e.preventDefault();
  searchGenre = [];

  let genreResults = $('#allGenresSearch').children('input:checked').map(function () {
    return $(this).val();
  });

  for(let x = 0;  x < genreResults.length; x++){
    searchGenre.push(genreResults[x]);
  }

  searchMovies();

});

//EVENT HANDLER TO DELETE A MOVIE
$(document).on('click', '.delete_movie', function (e) {
  e.preventDefault();
  let idErase = $(this).attr('id');

  getMovie(idErase).then(movie => {
    let decision = confirm(`Are you sure you want to Delete "${movie.title}" movie?`);

    if(decision){
      deleteMovie(idErase).then(displayMovies).catch(error => {
        alert('Wait. Something went wrong. Check console for details');
        console.log(error);
      });
    }
  }).catch(error => console.log(error));

});


//FUNCTION TO DISPLAY ALL MOVIES IN THE JSON DB
function displayMovies(){
  allMovies = [];

  getMovies().then((movies) => {
    $('#movieContent').html("");

    movies.forEach((movie) => {
      allMovies.push(movie);
      let card = createCard(movie);

      $('#movieContent').append(card);

    });

  }).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.')
    console.log(error);
  });


}

//FUNCTION TO CREATE A CARD FOR EACH MOVIE SELECTED
function createCard(movie){
  let editID = `edit${movie.id}`;
  let genres = "";

  movie.genre.forEach(function (genre) {
    genres += `<span class="badge badge-pill badge-light">${genre}</span>`;
  });

  return `<div class="card movieCard mb-3" style="max-width: 540px" id="card${movie.id}">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="" class="card-img" alt="">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text"><small class="text-muted mr-3">Date: ${movie.date}</small><small class="text-muted mr-3">Genre: ${genres}</small><small class="text-muted">Rating: ${movie.rating}</small></p>
                            <p class="card-text">${movie.description}</p>
                            <p>
                                <button type="button" class="btn btn-info edit_movie" data-toggle="modal" data-target="#editMovieModal" id="${editID}">Edit</button>
                                <button type="submit" class="btn btn-danger delete_movie" id="${movie.id}">Delete</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>`;
}

//function to get name of selected image
// $('#movieImageEdit').change(function () {
//   let file = $(this).files[0].name;
//   $(this).text(file);
// });

//EVENT HANDLER TO GET RATING SEARCH CRITERIA
$('.ratingFilter .dropdown-menu button').click(function () {
  searchRating = $(this).val();
  searchMovies();
});

//CLICK EVENT TO ADD A MOVIE TO JSON FILE
$('#addMovieClick').click(function (event) {
  event.preventDefault();
  console.log($('#movieAddDate').val());
  // event.stopPropagation();
  postMovie({
    title: document.getElementById('movieAddInput').value,
    rating: $('input[name = gridRadios]:checked').val(),
    //id auto generates
    date: $('#movieAddDate').val(),
    genre: movieAddObject.genre, //function for getting array List of genres
    description: document.getElementById('movieDescriptionInput').value,
    image: document.getElementById('movieImageAdd').value
  }).then(getMovies).then(movie =>{
    $('#addMovieModal').modal('toggle');
    $('#addMovieModal').find('form')[0].reset();
    $('#genreListAdd').empty();
    movieAddObject = {
      title:'',
      date:'',
      genre: [],
      description:'',
      rating: 0
    };
    console.log('all movies:');
    movie.forEach(({title, rating, id}) =>{
      console.log(`ID: ${id}, Title: ${title}, Rating: ${rating}`);
    });
  }).then(displayMovies).catch((error) =>{
    movieAddObject = {
      title:'',
      date:'',
      genre: [],
      description:'',
      rating: 0
    };
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
  });
});


function createGenreTag(genre,idTag){
  // global genre array
  if (movieAddObject.genre.includes(genre)){
    alert('Genre already Added');
    return movieAddObject.genre;
  }else {
    $(`#${idTag}`).append(`<li class ="list-group-item mt-2 mr-2" value="${genre}">${genre} | <span class="removeGenre">x</span></li>`);
    return movieAddObject.genre.push(genre);
  }
}

$('#addGenreButton').click(function () {
  return createGenreTag($('#genreMultiSelectA').children('option:selected').val(),'genreListAdd');
});

$('#editGenreButton').click(function () {
  return createGenreTag($('#genreMultiSelectE').children('option:selected').val(),'genreListEdit');
});

//BUTTON TO RESET ALL SEARCH CRITERIA AND DISPLAY ALL MOVIES
$('#resetButton').click(function (e) {
  e.preventDefault();

  searchTitle = undefined;
  searchDate = undefined;
  $('#dateSearch').val("");
  searchRating = 6;
  searchGenre = [];

  displayMovies();
});

// $('span').click(function () {
$('body').on('click', '.removeGenre',function () {
  let liValue = $(this).parent().text();
  liValue = liValue.slice(0,liValue.indexOf(" "));

  if (movieAddObject.genre.length === 1){
    movieAddObject.genre = [];
  }else {
    movieAddObject.genre = movieAddObject.genre.filter(function (genre) {
      return genre !== liValue;
    });
  }

  $(this).parent('li').remove();
  return movieAddObject.genre;
});


$('#addMovie').click(function () {
   movieAddObject = {
    id: 0,
    title:'',
    date:'',
    genre: [],
    description:'',
    rating: 0
  };
});

$('.edit_movie').click(function () {
  movieAddObject = {
    id: 0,
    title:'',
    date:'',
    genre: [],
    description:'',
    rating: 0
  };
});