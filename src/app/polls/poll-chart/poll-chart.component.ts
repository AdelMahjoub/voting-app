
import { 
  Component,
  ViewChild, 
  OnInit, 
  OnDestroy, 
  ElementRef} from '@angular/core';

import { 
  ActivatedRoute, 
  Params } from '@angular/router';

import Chart from 'chart.js';
import * as randomColor from 'randomcolor';

import { Subscription } from 'rxjs/Subscription';

import { Poll } from './../poll.model';
import { PollService } from './../poll-service';

interface BarChartColors {
  bgColors: string[];
  borderColors: string[];
}

@Component({
  selector: 'app-poll-chart',
  templateUrl: './poll-chart.component.html',
  styleUrls: ['./poll-chart.component.css']
})
export class PollChartComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chartCanvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  chart: Chart;
  
  poll: Poll;     // the pollt concerned by the chart
  pollId: string; // unique id to get from the route params

  routeParamsSubscription: Subscription;  // Listen to route params 
  getPollSubscription: Subscription;      // Listen to poll service 

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService) { }

  ngOnInit() {
    this.ctx = (<HTMLCanvasElement>this.chartCanvas.nativeElement).getContext('2d');
    this.init();
  }

  ngOnDestroy() {
    if(this.getPollSubscription) this.getPollSubscription.unsubscribe();
    if(this.routeParamsSubscription) this.routeParamsSubscription.unsubscribe();
  }

  init() {
    // Get the pollid
    this.routeParamsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.pollId = params['pollid'];
        // Get the poll
        this.getPollSubscription = this.pollService.getPollById(this.pollId).subscribe(
          (poll: Poll) => {
            this.poll = poll;
            this.drawBarChart();
          }
        );
      }
     );
  }

  drawBarChart() {

    // Chart data to display
    let labels = this.poll.options.map(option => option.label);
    let data = this.poll.options.map(option => option.votes);

    // Chart colors
    let count = this.poll.options.length;
    let colors = this.getRandomColors(count);

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '#Votes',
          data: data,
          backgroundColor: colors.bgColors,
          borderColor: colors.borderColors,
        }]
      },
      options: {
        responseive: true,
        maintainAspectRation: false,
        layout: {
          padding: 0
        },
        elements: {
          rectangle: {
            borderWidth: 2
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              color: '#333'
            },
            barPercentage: 1,
            categoryPercentage: 0.5,
            ticks: {
              beginAtZero: true,
              autoSkip: false,
              callback: (value, index, values) => {
                return this.shortenString(value, 20);
              }
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }],
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              let index = tooltipItems[0].index;
              return data.labels[index];
            }
          }
        }
      }
    });
  }

  // Shorten a string to a given limit and append ...
  shortenString(str: string, limit: number) {
    if(str.length > limit) {
      let label = str.substr(0, 20);
      label += '...';
      return label;
    }
    return str;
  }

  // Generate random colors for the chart
  getRandomColors(count: number): BarChartColors {
     let i = 0;
     let bgColors: string[] = [];
     let borderColors: string[] = [];
     while(i < count) {
        let seed = ~~((Math.random() + 1) * 100);
        // The returned color is the same for a given seed
        // Set the same color for background and border
        // but with different opacity
        bgColors.push(randomColor({
          seed,
          format: 'rgba',
          alpha: 0.5
        }));
        borderColors.push(randomColor({
          seed,
          format: 'rgba',
          alpha: 1
        }));
        i++
     }
     return { bgColors, borderColors }
  }

}
