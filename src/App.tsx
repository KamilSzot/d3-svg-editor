import {useRef, useState, useEffect} from 'react';
import * as d3 from 'd3';

import logo from './logo.svg';
import './App.css';
import { exception } from 'console';
import { unescapeLeadingUnderscores } from 'typescript';


class Point {
  constructor(public x = 0, public y = 0) {};
  copy() { return new Point(this.x, this.y) };
  moveTo(p: Point) { this.x = p.x; this.y = p.y; }
  toString() { return this.x+' '+this.y; }
}

var points = [
  new Point(256, 256),
  new Point(512, 512),
  new Point(256, 512),
  new Point(512, 256),
];

var paths = [
  [points[0], points[1], points[2], points[3]]
]
document.addEventListener('contextmenu', event => event.preventDefault());

class Dragger {
  public target?: Point;
  public original?: Point;
  public mouseStartedFrom?: Point;

  start(p: Point, e:MouseEvent) {
    console.log(e.button)
    if(!this.target) {
      if(e.button == 0) {
        this.target = p;
        this.original = p.copy();
  
        this.mouseStartedFrom = new Point(e.pageX, e.pageY);
      }

    } else {

      if(e.button == 2) {
        if(this.target) {
          this.target.moveTo(this.original!);
          ui.update();
          e.preventDefault();
          this.target = undefined;
        }
      }
      if(e.button == 0) {
        throw 'Already dragging something';
      }
  }
  }

  drag(e: MouseEvent) {
    if(this.target) {
      this.target.x = this.original!.x + e.pageX - this.mouseStartedFrom!.x;
      this.target.y = this.original!.y + e.pageY - this.mouseStartedFrom!.y;

      ui.update();
    }
  }

  stop(e: MouseEvent) {
    if(this.target) {
      if(e.button == 0) {
        this.target = undefined;
      }
    }
  }
}

var dragger = new Dragger();

class UI {
  public svg?:d3.Selection<SVGSVGElement, any, any, any>;
  recreate(container:HTMLElement) {
      this.svg = d3.select(container)
      .append('svg')
      .attr('style', 'background: white')
      .attr('width', 1024)
      .attr('height', 768)
      .on('mousemove', (e) => {
        dragger.drag(e);
      })
      .on('mouseup', (e, d) => {
        dragger.stop(e);
      })
      // .on('mouseleave', (e, d) => {
      //   dragger.stop(e);
      // })

      
      this.svg.selectAll('path')
      .data(paths)
      .enter()
      .append('path')
      .attr('fill', 'transparent')
      .attr('stroke-width', 3)
      .attr('stroke', 'green')
      
      .attr('d', (d) => `M${d[0]} C${d[1]}, ${d[2]}, ${d[3]}`)

      this.svg.selectAll('cicrle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', (d,i) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', d=>7)
      .attr('fill', 'teal')
      .on('mousedown', (e, d) => {
        dragger.start(d, e);
      })


  }
  update() {
    if(this.svg) {
      this.svg.selectAll('circle')
        .data(points)
        .attr('cx', (d,i) => d.x)
        .attr('cy', (d) => d.y)
        
      this.svg.selectAll('path')
        .data(paths)        
        .attr('d', (d) => `M${d[0]} C${d[1]}, ${d[2]}, ${d[3]}`)
      }
  }
}




var ui = new UI();

function App() {
  let [visible, setVisible] = useState(true);
  let canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(canvasRef.current !== null) {
      ui.recreate(canvasRef.current);
    }  
  }, [canvasRef, visible]);

  const toggle = () => {
    setVisible((v)=> !v);
  }
  return (
    <div className="App">
      <button onClick={toggle}>show</button>
      { visible ?
        <header className="App-header">
          <div ref={canvasRef} />
        </header> : null
      }
    </div>
  );
}

export default App;
