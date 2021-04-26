<template>
  <div id="app">
    <div>
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">


// Import Bulma's core
@import "~bulma/sass/utilities/_all";
$grey-darker: #1f2d3b;
$grey-dark: #2b3e50;
$grey: #4e5d6c;
$grey-light: #8694a4;
$grey-lighter: #dee5ed;

$orange: #df691a;
$yellow: #f0ad4e;
$green: #4ec1a0;
$blue: #5bc0de;
$red: #d9534f;

$primary: $orange !default;

$dark: darken($grey-darker, 3);

$title-color: $grey-lighter;
$title-weight: 400;
$subtitle-strong-color: $grey-lighter;
$subtitle-color: darken($grey-lighter, 10);
$subtitle-strong-color: darken($grey-lighter, 10);

$background: $grey-dark;
$body-background-color: $grey-darker;
$footer-background-color: $background;

$border: $grey;

$family-sans-serif: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;

$text: $grey-lighter;
$text-strong: darken($grey-lighter, 10);
$text-light: $grey-light;

$box-background-color: $background;

$card-shadow: none;
$card-background-color: darken($body-background-color, 1);
$card-header-box-shadow: none;
$card-header-background-color: darken($body-background-color, 3);
$card-footer-background-color: darken($body-background-color, 3);

$link: $grey-light;
$link-hover: $grey-lighter;
$link-focus: $grey-lighter;
$link-active: $grey-lighter;

$button-color: $grey-lighter;
$button-background-color: $grey;
$button-border-color: $grey;

$button-hover-border: transparent;
$button-active-border-color: transparent;

$radius: 0;
$radius-small: 0;

$input-hover-color: $link-hover;
$input-color: $grey-darker;
$input-icon-color: $grey;
$input-icon-active-color: $input-color;

$table-color: $text;
$table-head-color: $grey-lighter;
$table-background-color: $grey-dark;
$table-cell-border: 1px solid $grey;
$table-row-hover-background-color: $grey-darker;
$table-striped-row-even-background-color: $grey-darker;
$table-striped-row-even-hover-background-color: lighten($grey-darker, 4);

$navbar-background-color: $background;
$navbar-item-color: $text;
$navbar-item-hover-color: $grey-light;
$navbar-item-active-color: $primary;
$navbar-item-hover-background-color: rgba($grey-darker, 0.1);
$navbar-item-active-background-color: rgba($grey-darker, 0.1);
$navbar-dropdown-item-hover-color: $grey-light;
$navbar-dropdown-item-active-color: $primary;
$navbar-dropdown-background-color: $background;
$navbar-dropdown-arrow: currentColor;

$dropdown-content-background-color: $background;
$dropdown-item-color: $text;
$dropdown-item-hover-color: $text-light;

$tabs-toggle-link-active-background-color: $background;
$tabs-toggle-link-active-border-color: $border;
$tabs-toggle-link-active-color: #fff;
$tabs-boxed-link-active-background-color: $body-background-color;

$pagination-color: $link;
$pagination-border-color: $border;

$bulmaswatch-import-font: true !default;

$file-cta-background-color: $grey-darker;

$progress-bar-background-color: $grey-dark;

$panel-heading-background-color: $grey-dark;
@if $bulmaswatch-import-font {
  @import url("https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap");
}

.section {
  background-color: $body-background-color;
}

.hero {
  background-color: $body-background-color;
}

.button {
  &.is-hovered,
  &:hover {
    background-color: darken($button-background-color, 3%);
  }
  @each $name, $pair in $colors {
    $color: nth($pair, 1);
    $color-invert: nth($pair, 2);

    &.is-#{$name} {
      &.is-hovered,
      &:hover {
        background-color: darken($color, 3%);
      }
    }
  }

  &.is-loading:after {
    border-color: transparent transparent $grey-light $grey-light;
  }
}

.label {
  color: $grey-lighter;
}

.notification {
  @each $name, $pair in $colors {
    $color: nth($pair, 1);
    $color-invert: nth($pair, 2);

    &.is-#{$name} {
      a:not(.button) {
        color: $color-invert;
        text-decoration: underline;
      }
    }
  }
}

.card {
  border: 1px solid $border;
  border-radius: $radius;

  .card-image {
    img {
      border-radius: $radius $radius 0 0;
    }
  }

  .card-header {
    border-radius: $radius $radius 0 0;
  }

  .card-footer,
  .card-footer-item {
    border-width: 1px;
    border-color: $border;
  }
}

.modal-card-body {
  background-color: $body-background-color;
}

.navbar {

  &.is-transparent {
    background-color: transparent;
  }

  @include touch {
    .navbar-menu {
      background-color: transparent;
    }
  }

  @each $name, $pair in $colors {
    $color: nth($pair, 1);
    $color-invert: nth($pair, 2);

    &.is-#{$name} {
      @include touch {
        .navbar-item,
        .navbar-link {
          color: $color-invert;

          &.is-active {
            color: #d9534f;
          }
        }

        .navbar-burger {
          span {
            background-color: $color-invert;
          }
        }
      }
    }
  }
}

.hero {
  .navbar {
    .navbar-dropdown {
      .navbar-item {
        color: $grey-lighter;
      }
    }
  }
}


// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');


body {
  font-family: 'Roboto Mono', monospace;
}


</style>
