import { Template } from '../../models';

export const graphStarter: Template = {
  name: 'graph',
  title: 'Graph Starter',
  thumbnail: 'assets/templates/graph.svg',
  activeEditor: 'markup',
  markup: {
    language: 'graph',
    content: `
<div class="container">
  <h3>Gnuplot</h3>
  <div data-src="contour.svg"></div>

  <h3>Graphviz</h3>
  <div data-src="flow-chart.svg"></div>

  <h3>Mermaid</h3>
  <div data-src="class-diagram.svg"></div>

  <h3>Vega</h3>
  <div data-src="vega.svg"></div>

  <h3>VegaLite</h3>
  <div data-src="vega-lite.svg"></div>

  <h3>Plotly</h3>
  <!-- any graph can be rendered as image -->
  <img data-src="box.svg">

  <h3>Nomnoml</h3>
  <img data-src="nomnoml.svg">

  <h3>WaveDrom</h3>
  <div data-src="diagram.svg"></div>

  <h3>Pintora</h3>
  <img data-src="pintora.svg">
</div>

<script type="application/graph-gnuplot">
set terminal svg size 600,400 enhanced fname 'arial' fsize 10 butt solid
set output 'contour.svg'
set view 60, 30, 0.85, 1.1
set samples 25, 25
set isosamples 26, 26
set contour base
set cntrparam bspline
set cntrparam levels auto 10
set style data lines
set title "3D gnuplot demo - contour of data grid plotting"
set xlabel "X axis"
set xrange [ 0.00000 : 15.0000 ] noreverse nowriteback
set ylabel "Y axis"
set yrange [ 0.00000 : 15.0000 ] noreverse nowriteback
set zlabel "Z axis"
set zlabel  offset character 1, 0, 0 font "" textcolor lt -1 norotate
set zrange [ -1.20000 : 1.20000 ] noreverse nowriteback

# "glass.dat" is defined below
splot "glass.dat" using 1
</script>

<script type="application/graph-gnuplot-file" src="https://raw.githubusercontent.com/gnuplot/gnuplot/master/demo/glass.dat"></script>
<!--  or inline content in script block -->
<!--
<script type="application/graph-gnuplot-file" data-file="glass.dat">
  0.568000   0.000000  -0.911000
  0.518894   0.231026  -0.911000
  0.380066   0.422106  -0.911000
  0.175522   0.540200  -0.911000
 -0.059372   0.564888  -0.911000
</script>
 -->


<script type="application/graph-graphviz" data-output="flow-chart.svg">
  digraph G {
      node [shape=rect];

      subgraph cluster_0 {
          style=filled;
          color=lightgrey;
          node [style=filled,color=white];
          a0 -> a1 -> a2 -> a3;
          label = "Hello";
      }

      subgraph cluster_1 {
          node [style=filled];
          b0 -> b1 -> b2 -> b3;
          label = "World!";
          color=blue
      }

      start -> a0;
      start -> b0;
      a1 -> b3;
      b2 -> a3;
      a3 -> a0;
      a3 -> end;
      b3 -> end;

      start [shape=Mdiamond];
      end [shape=Msquare];
  }
</script>


<script type="application/graph-mermaid" data-output="class-diagram.svg">
classDiagram
Class01 <|-- AveryLongClass : Cool
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
Class08 <--> C2: Cool label
</script>


<script
  type="application/graph-vega"
  data-output="vega.svg"
  src="https://vega.github.io/vega/examples/stacked-bar-chart.vg.json"
></script>


<script
  type="application/graph-vega-lite"
  data-output="vega-lite.svg"
  src="https://vega.github.io/vega-lite/examples/sequence_line_fold.vl.json"
></script>

<script type="application/graph-plotly" data-output="box.svg">
{
  "data": [
    {
      "y": [
        0.2,
        0.2,
        0.6,
        1,
        0.5,
        0.4,
        0.2,
        0.7,
        0.9,
        0.1,
        0.5,
        0.3
      ],
      "x": [
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2"
      ],
      "name": "kale",
      "marker": {
        "color": "#3D9970"
      },
      "type": "box"
    },
    {
      "y": [
        0.6,
        0.7,
        0.3,
        0.6,
        0,
        0.5,
        0.7,
        0.9,
        0.5,
        0.8,
        0.7,
        0.2
      ],
      "x": [
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2"
      ],
      "name": "radishes",
      "marker": {
        "color": "#FF4136"
      },
      "type": "box"
    },
    {
      "y": [
        0.1,
        0.3,
        0.1,
        0.9,
        0.6,
        0.6,
        0.9,
        1,
        0.3,
        0.6,
        0.8,
        0.5
      ],
      "x": [
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 1",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2",
        "day 2"
      ],
      "name": "carrots",
      "marker": {
        "color": "#FF851B"
      },
      "type": "box"
    }
  ],
  "layout": {
    "yaxis": {
      "title": "normalized moisture",
      "zeroline": false
    },
    "boxmode": "group"
  }
}
</script>


<script type="application/graph-nomnoml" data-output="nomnoml.svg">
[Pirate|eyeCount: Int|raid();pillage()|
  [beard]--[parrot]
  [beard]-:>[foul mouth]
]

[<table>mischief | bawl | sing || yell | drink]

[<abstract>Marauder]<:--[Pirate]
[Pirate]- 0..7[mischief]
[jollyness]->[Pirate]
[jollyness]->[rum]
[jollyness]->[singing]
[Pirate]-> *[rum|tastiness: Int|swig()]
[Pirate]->[singing]
[singing]<->[rum]

[<start>st]->[<state>plunder]
[plunder]->[<choice>more loot]
[more loot]->[st]
[more loot] no ->[<end>e]

[<actor>Sailor] - [<usecase>shiver me;timbers]
</script>


<script type="application/graph-wavedrom" data-output="diagram.svg">
{ signal : [
  { name: "clk",  wave: "p......" },
  { name: "bus",  wave: "x.34.5x",   data: "head body tail" },
  { name: "wire", wave: "0.1..0." },
]}
</script>


<script type="application/graph-pintora" data-output="pintora.svg">
mindmap
@param layoutDirection TB
* Pintora diagrams
** UML Diagrams
*** Sequence Diagram
*** Activity Diagram
*** Component Diagram
** Non-UML Diagrams
*** Entity Relationship Diagram
*** Mind Map
</script>
`.trimStart(),
  },
  style: {
    language: 'css',
    content: `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container img {
  width: 80%;
  max-width: 600px;
}

.container h3:not(:nth-child(1)) {
  margin-top: 3em;
}
`.trimStart(),
  },
  script: {
    language: 'javascript',
    content: '',
  },
  stylesheets: [],
  scripts: [],
  cssPreset: '',
  imports: {},
  types: {},
};
