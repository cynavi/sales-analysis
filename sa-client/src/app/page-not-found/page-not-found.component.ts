import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="site flex xy-center">
      <div class="sketch">
        <div class="bee-sketch red"></div>
        <div class="bee-sketch blue"></div>
      </div>
      <h1>404!
        <small>this page doesn't exist</small>
        <small style="color: darkred">...like your social life</small>
      </h1>
    </div>
  `,
  styles: `
    @import url('https://fonts.googleapis.com/css?family=Cabin+Sketch');
    h1 {
      font-family: 'Cabin Sketch', cursive;
      font-size: 3em;
      text-align: center;
      opacity: .8;
      order: 1;
    }

    h1 small {
      display: block;
    }

    .site {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      flex-direction: column;
      margin: 0 auto;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      height: calc(100vh - 84px);
    }


    .sketch {
      position: relative;
      height: 400px;
      min-width: 400px;
      margin: 0;
      overflow: visible;
      order: 2;

    }

    .bee-sketch {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .red {
      background: url('public/images/red-1.png') no-repeat center center;
      opacity: 1;
      animation: red 3s linear infinite, opacityRed 5s linear alternate infinite;
    }

    .blue {
      background: url('public/images/blue-1.png') no-repeat center center;
      opacity: 0;
      animation: blue 3s linear infinite, opacityBlue 5s linear alternate infinite;
    }


    @media only screen and (min-width: 780px) {
      .site {
        flex-direction: row;
        padding: 1em 3em 1em 0em;
      }

      h1 {
        text-align: right;
        order: 2;
        padding-bottom: 2em;
        padding-left: 2em;

      }

      .sketch {
        order: 1;
      }
    }


    @keyframes blue {
      0% {
        background-image: url('public/images/blue-1.png')
      }
      9.09% {
        background-image: url('public/images/blue-2.png')
      }
      27.27% {
        background-image: url('public/images/blue-3.png')
      }
      36.36% {
        background-image: url('public/images/blue-4.png')
      }
      45.45% {
        background-image: url('public/images/blue-5.png')
      }
      54.54% {
        background-image: url('public/images/blue-6.png')
      }
      63.63% {
        background-image: url('public/images/blue-7.png')
      }
      72.72% {
        background-image: url('public/images/blue-8.png')
      }
      81.81% {
        background-image: url('public/images/blue-9.png')
      }
      100% {
        background-image: url('public/images/blue-1.png')
      }
    }

    @keyframes red {
      0% {
        background-image: url('public/images/red-1.png')
      }
      9.09% {
        background-image: url('public/images/red-2.png')
      }
      27.27% {
        background-image: url('public/images/red-3.png')
      }
      36.36% {
        background-image: url('public/images/red-4.png')
      }
      45.45% {
        background-image: url('public/images/red-5.png')
      }
      54.54% {
        background-image: url('public/images/red-6.png')
      }
      63.63% {
        background-image: url('public/images/red-7.png')
      }
      72.72% {
        background-image: url('public/images/red-8.png')
      }
      81.81% {
        background-image: url('public/images/red-9.png')
      }
      100% {
        background-image: url('public/images/red-1.png')
      }
    }

    @keyframes opacityBlue {
      from {
        opacity: 0
      }
      25% {
        opacity: 0
      }
      75% {
        opacity: 1
      }
      to {
        opacity: 1
      }
    }

    @keyframes opacityRed {
      from {
        opacity: 1
      }
      25% {
        opacity: 1
      }
      75% {
        opacity: .3
      }
      to {
        opacity: .3
      }
    }
  `
})
export class PageNotFoundComponent {
}
