import { Template } from '../../models';

export const gnuplotStarter: Template = {
  name: 'gnuplot',
  title: 'Gnuplot Starter',
  thumbnail: 'assets/templates/gnuplot.svg',
  activeEditor: 'markup',
  markup: {
    language: 'gnuplot',
    content: `
<div class="container">
  <img data-src="transparent_solids.svg" />
  <img data-src="contour.svg" />
  <img data-src="force.svg" />
</div>

<script type="gnuplot/script">
set terminal svg size 600,400 dynamic enhanced fname 'arial'  fsize 10 mousing name "transparent_solids_2" butt solid
set output 'transparent_solids.svg'
unset border
set style fill  transparent solid 0.65 border
set dummy u,v
unset key
set label 1 "Kuen's Surface" at screen 0.57, 0.9, 0 left norotate font "frscript,20" back nopoint offset character 0, 0, 0
set style line 2  linetype 2 linecolor rgb "#a0a0f0"  linewidth 0.500 pointtype 2 pointsize default pointinterval 0
set style line 3  linetype -1 linewidth 0.500 pointtype -1 pointsize default pointinterval 0
set object  1 rect from screen 0, 0, 0 to screen 1, 1, 0
set object  1 behind lw 1.0 fc  rgb "gray"  fillstyle   solid 1.00 border lt -1
set parametric
set view 122, 357, 1.35, 1.08
set isosamples 51, 51
set hidden3d back offset 1 trianglepattern 3 undefined 1 altdiagonal bentover
set ticslevel 0
set noxtics
set noytics
set noztics
set urange [ -4.50000 : 4.50000 ] noreverse nowriteback
set vrange [ 0.0500000 : 3.09159 ] noreverse nowriteback
set lmargin at screen 0.1
set bmargin at screen 0.1
set rmargin at screen 0.9
set tmargin at screen 0.9
set pm3d depthorder
set pm3d interpolate 1,1 flush begin noftriangles hidden3d 3 corners2color mean
unset colorbox
x(u,v) = 2.*a*(cos(u)+u*sin(u))*sin(v) / (1+u**2.*(sin(v))**2)
y(u,v) = 2.*a*(sin(u)-u*cos(u))*sin(v) / (1+u**2.*(sin(v))**2)
z(u,v) = a*log(tan(v/2.))+2.*cos(v)/(1+u**2.*(sin(v))**2)
a = 1.0
GPFUN_x = "x(u,v) = 2.*a*(cos(u)+u*sin(u))*sin(v) / (1+u**2.*(sin(v))**2)"
GPFUN_y = "y(u,v) = 2.*a*(sin(u)-u*cos(u))*sin(v) / (1+u**2.*(sin(v))**2)"
GPFUN_z = "z(u,v) = a*log(tan(v/2.))+2.*cos(v)/(1+u**2.*(sin(v))**2)"
splot x(u,v), y(u,v), z(u,v) with pm3d
</script>

<script type="gnuplot/script">
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

<script type="gnuplot/script">
# Scale font and line width (dpi) by changing the size! It will always display stretched.
set terminal svg size 400,300 enhanced fname 'arial'  fsize 10 butt solid
set output 'force.svg'

# Key means label...
set key inside bottom right
set xlabel 'Deflection (m)'
set ylabel 'Force (kN)'
set title 'Sample data loaded from URL'

# "force.dat" is is loaded from URL
plot  "force.dat" using 1:2 title 'Col-Force' with lines, "force.dat" using 1:3 title 'Beam-Force' with linespoints
</script>

<script type="gnuplot/file" data-url="https://cdn.jsdelivr.net/npm/gnuplot@0.3.1/dat/force.dat"></script>

<script type="gnuplot/file" data-file="glass.dat">
# 16x16 grid Glass shape. Created Using DRAWFN3D, Gershon Elber 1990.
#
  0.568000   0.000000  -0.911000
  0.518894   0.231026  -0.911000
  0.380066   0.422106  -0.911000
  0.175522   0.540200  -0.911000
 -0.059372   0.564888  -0.911000
 -0.284000   0.491902  -0.911000
 -0.459522   0.333862  -0.911000
 -0.555588   0.118094  -0.911000
 -0.555588  -0.118094  -0.911000
 -0.459522  -0.333862  -0.911000
 -0.284000  -0.491902  -0.911000
 -0.059372  -0.564888  -0.911000
  0.175522  -0.540200  -0.911000
  0.380066  -0.422106  -0.911000
  0.518894  -0.231027  -0.911000
  0.568000  -0.000000  -0.911000

  0.341741   0.000000  -0.905215
  0.312196   0.138999  -0.905215
  0.228669   0.253963  -0.905215
  0.105604   0.325015  -0.905215
 -0.035722   0.339869  -0.905215
 -0.170870   0.295956  -0.905215
 -0.276474   0.200870  -0.905215
 -0.334273   0.071052  -0.905215
 -0.334273  -0.071052  -0.905215
 -0.276474  -0.200870  -0.905215
 -0.170871  -0.295956  -0.905215
 -0.035722  -0.339869  -0.905215
  0.105604  -0.325015  -0.905215
  0.228669  -0.253963  -0.905215
  0.312196  -0.138999  -0.905215
  0.341741  -0.000000  -0.905215

  0.212153   0.000000  -0.863178
  0.193812   0.086290  -0.863178
  0.141958   0.157661  -0.863178
  0.065559   0.201770  -0.863178
 -0.022176   0.210991  -0.863178
 -0.106077   0.183730  -0.863178
 -0.171636   0.124701  -0.863178
 -0.207517   0.044109  -0.863178
 -0.207517  -0.044109  -0.863178
 -0.171636  -0.124701  -0.863178
 -0.106077  -0.183730  -0.863178
 -0.022176  -0.210991  -0.863178
  0.065559  -0.201770  -0.863178
  0.141958  -0.157661  -0.863178
  0.193812  -0.086291  -0.863178
  0.212153  -0.000000  -0.863178

  0.138097   0.000000  -0.764660
  0.126157   0.056169  -0.764660
  0.092405   0.102626  -0.764660
  0.042674   0.131338  -0.764660
 -0.014435   0.137340  -0.764660
 -0.069048   0.119595  -0.764660
 -0.111722   0.081171  -0.764660
 -0.135079   0.028712  -0.764660
 -0.135079  -0.028712  -0.764660
 -0.111722  -0.081171  -0.764660
 -0.069048  -0.119595  -0.764660
 -0.014435  -0.137340  -0.764660
  0.042674  -0.131338  -0.764660
  0.092405  -0.102626  -0.764660
  0.126157  -0.056169  -0.764660
  0.138097  -0.000000  -0.764660

  0.098588   0.000000  -0.618872
  0.090065   0.040099  -0.618872
  0.065968   0.073265  -0.618872
  0.030465   0.093763  -0.618872
 -0.010305   0.098048  -0.618872
 -0.049294   0.085380  -0.618872
 -0.079760   0.057949  -0.618872
 -0.096434   0.020498  -0.618872
 -0.096434  -0.020498  -0.618872
 -0.079760  -0.057949  -0.618872
 -0.049294  -0.085380  -0.618872
 -0.010305  -0.098048  -0.618872
  0.030465  -0.093763  -0.618872
  0.065968  -0.073265  -0.618872
  0.090065  -0.040099  -0.618872
  0.098588  -0.000000  -0.618872

  0.084164   0.000000  -0.452254
  0.076887   0.034232  -0.452254
  0.056317   0.062546  -0.452254
  0.026008   0.080044  -0.452254
 -0.008798   0.083703  -0.452254
 -0.042082   0.072888  -0.452254
 -0.068090   0.049470  -0.452254
 -0.082325   0.017499  -0.452254
 -0.082325  -0.017499  -0.452254
 -0.068090  -0.049470  -0.452254
 -0.042082  -0.072888  -0.452254
 -0.008798  -0.083703  -0.452254
  0.026008  -0.080045  -0.452254
  0.056317  -0.062546  -0.452254
  0.076887  -0.034233  -0.452254
  0.084164  -0.000000  -0.452254

  0.092386   0.000000  -0.291706
  0.084399   0.037577  -0.291706
  0.061819   0.068656  -0.291706
  0.028549   0.087865  -0.291706
 -0.009657   0.091880  -0.291706
 -0.046193   0.080009  -0.291706
 -0.074742   0.054303  -0.291706
 -0.090368   0.019208  -0.291706
 -0.090368  -0.019208  -0.291706
 -0.074742  -0.054303  -0.291706
 -0.046193  -0.080009  -0.291706
 -0.009657  -0.091880  -0.291706
  0.028549  -0.087865  -0.291706
  0.061819  -0.068656  -0.291706
  0.084399  -0.037577  -0.291706
  0.092386  -0.000000  -0.291706

  0.124988   0.000000  -0.153861
  0.114183   0.050837  -0.153861
  0.083634   0.092885  -0.153861
  0.038624   0.118871  -0.153861
 -0.013065   0.124304  -0.153861
 -0.062494   0.108243  -0.153861
 -0.101118   0.073466  -0.153861
 -0.122257   0.025987  -0.153861
 -0.122257  -0.025987  -0.153861
 -0.101118  -0.073466  -0.153861
 -0.062494  -0.108243  -0.153861
 -0.013065  -0.124304  -0.153861
  0.038624  -0.118871  -0.153861
  0.083634  -0.092885  -0.153861
  0.114183  -0.050837  -0.153861
  0.124988  -0.000000  -0.153861

  0.185015   0.000000  -0.041791
  0.169020   0.075253  -0.041791
  0.123799   0.137493  -0.041791
  0.057173   0.175960  -0.041791
 -0.019339   0.184002  -0.041791
 -0.092508   0.160228  -0.041791
 -0.149681   0.108749  -0.041791
 -0.180972   0.038467  -0.041791
 -0.180972  -0.038467  -0.041791
 -0.149681  -0.108749  -0.041791
 -0.092508  -0.160228  -0.041791
 -0.019339  -0.184002  -0.041791
  0.057173  -0.175960  -0.041791
  0.123799  -0.137493  -0.041791
  0.169020  -0.075253  -0.041791
  0.185015  -0.000000  -0.041791

  0.273264   0.000000   0.053395
  0.249639   0.111146   0.053395
  0.182849   0.203075   0.053395
  0.084443   0.259889   0.053395
 -0.028564   0.271767   0.053395
 -0.136632   0.236653   0.053395
 -0.221075   0.160620   0.053395
 -0.267292   0.056815   0.053395
 -0.267292  -0.056815   0.053395
 -0.221075  -0.160620   0.053395
 -0.136632  -0.236653   0.053395
 -0.028564  -0.271767   0.053395
  0.084443  -0.259889   0.053395
  0.182849  -0.203075   0.053395
  0.249639  -0.111146   0.053395
  0.273264  -0.000000   0.053395

  0.384384   0.000000   0.149114
  0.351152   0.156343   0.149114
  0.257203   0.285653   0.149114
  0.118781   0.365570   0.149114
 -0.040179   0.382278   0.149114
 -0.192192   0.332886   0.149114
 -0.310973   0.225935   0.149114
 -0.375984   0.079918   0.149114
 -0.375984  -0.079918   0.149114
 -0.310973  -0.225935   0.149114
 -0.192192  -0.332886   0.149114
 -0.040179  -0.382278   0.149114
  0.118781  -0.365571   0.149114
  0.257203  -0.285653   0.149114
  0.351152  -0.156343   0.149114
  0.384384  -0.000000   0.149114

  0.504089   0.000000   0.267473
  0.460508   0.205031   0.267473
  0.337301   0.374611   0.267473
  0.155772   0.479417   0.267473
 -0.052692   0.501327   0.267473
 -0.252044   0.436554   0.267473
 -0.407816   0.296296   0.267473
 -0.493073   0.104806   0.267473
 -0.493073  -0.104806   0.267473
 -0.407816  -0.296296   0.267473
 -0.252044  -0.436554   0.267473
 -0.052692  -0.501327   0.267473
  0.155772  -0.479417   0.267473
  0.337301  -0.374611   0.267473
  0.460508  -0.205031   0.267473
  0.504089  -0.000000   0.267473

  0.609609   0.000000   0.430046
  0.556906   0.247950   0.430046
  0.407908   0.453028   0.430046
  0.188380   0.579773   0.430046
 -0.063721   0.606270   0.430046
 -0.304805   0.527937   0.430046
 -0.493184   0.358319   0.430046
 -0.596288   0.126745   0.430046
 -0.596288  -0.126745   0.430046
 -0.493184  -0.358319   0.430046
 -0.304805  -0.527937   0.430046
 -0.063722  -0.606270   0.430046
  0.188380  -0.579773   0.430046
  0.407908  -0.453028   0.430046
  0.556906  -0.247951   0.430046
  0.609609  -0.000000   0.430046

  0.675154   0.000000   0.647779
  0.616784   0.274610   0.647779
  0.451766   0.501737   0.647779
  0.208634   0.642110   0.647779
 -0.070573   0.671455   0.647779
 -0.337577   0.584700   0.647779
 -0.546211   0.396846   0.647779
 -0.660400   0.140372   0.647779
 -0.660400  -0.140372   0.647779
 -0.546211  -0.396845   0.647779
 -0.337577  -0.584700   0.647779
 -0.070573  -0.671455   0.647779
  0.208634  -0.642110   0.647779
  0.451766  -0.501737   0.647779
  0.616784  -0.274610   0.647779
  0.675154  -0.000000   0.647779

  0.681825   0.000000   0.900691
  0.622878   0.277323   0.900691
  0.456230   0.506695   0.900691
  0.210696   0.648454   0.900691
 -0.071270   0.678090   0.900691
 -0.340913   0.590478   0.900691
 -0.551608   0.400767   0.900691
 -0.666926   0.141760   0.900691
 -0.666926  -0.141759   0.900691
 -0.551608  -0.400767   0.900691
 -0.340913  -0.590478   0.900691
 -0.071270  -0.678090   0.900691
  0.210695  -0.648454   0.900691
  0.456230  -0.506695   0.900691
  0.622878  -0.277324   0.900691
  0.681825  -0.000000   0.900691

  0.626000   0.000000   1.101000
  0.571879   0.254617   1.101000
  0.418876   0.465209   1.101000
  0.193445   0.595361   1.101000
 -0.065435   0.622571   1.101000
 -0.313000   0.542132   1.101000
 -0.506445   0.367954   1.101000
 -0.612320   0.130153   1.101000
 -0.612320  -0.130153   1.101000
 -0.506445  -0.367953   1.101000
 -0.313000  -0.542132   1.101000
 -0.065435  -0.622571   1.101000
  0.193444  -0.595361   1.101000
  0.418876  -0.465209   1.101000
  0.571879  -0.254617   1.101000
  0.626000  -0.000000   1.101000
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
}`.trimStart(),
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