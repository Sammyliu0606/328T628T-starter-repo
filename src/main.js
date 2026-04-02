import './styles.css'
import { Chart, plugins, scales } from 'chart.js/auto' // A complete build of chart.js - not advised for production, but okay for our purposes
import { csvParse } from 'd3' // A single exported module from d3 for reading csv files

async function loadAndChartData() {
  const response = await fetch('data/police_shootings_wide.csv')
	const csvText = await response.text()
	const data = csvParse(csvText)
	
  const ctx = document.getElementById('chart01') // The DOM element where we want to put our chart

  	Chart.defaults.color = 'white' // sets default font color

  new Chart(
    ctx, 
    {
      type: 'line',
      data: {
        labels: data.map(d => d.Year),
				datasets:[
        {
					label: 'Fatal Police Shootings in the US',
					data: data.map(d => d['Fatal police shootings (US)']),
					borderColor: 'red',
					fill: false
				},
        {
          label: 'Fatal Police Shootings in Canada',
          data: data.map(d => d['Fatal police shootings (Canada)']),
          borderColor: 'blue',
          fill: false
        }
      ]
    },
			options: {
				plugins: { // how we access our legend
					legend: {
						labels: {
							font: { // bigger font for legend
								size: 16,
								weight: 'bold'
							}
						}
					}
				},
				responsive: true,
				scales: { // where our axis options live
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Number of Incidents',
							font: {
								size: 16,
								weight: 'bold'
							}
						},
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
					},
					x: {
						title: {
							display: true,
							text: 'Year',
							font: {
								size: 16,
								weight: 'bold'
							},
						},
            ticks: {
              color: 'white'
            },
            grid: {
              display: false,
              borderColor: 'white'
            }
          }
        }
			}
    }
  );
}

loadAndChartData()

async function loadAndChartData2() {
  const response = await fetch('data/ai_index_main.csv')
  const csvText = await response.text()
  const data = csvParse(csvText)
  const ctx = document.getElementById('chart02')

  const continents = [...new Set(data.map(d => d.continent))] // Get unique list of continents
  const continentColors = { // set color palette for continents
  'Asia': '188, 71, 54',
  'Europe': '110, 146, 133',
  'North America': '215, 175, 102',
  'South America': '165, 117, 81',
  'Africa': '74, 98, 116'
};

  const datasets = continents.map(continent => { // I want to color code by continent and also make the opacity of the points reflect the year (darker = more recent)
    const continentData = data.filter(d => d.continent === continent);
    const baseColor = continentColors[continent];

    return {
      label: continent,
      data: continentData.map(d => {
        // Because backgroundColor settings usually expect a single value for the whole dataset, we have to calculate the color for each point in the data and then pull it into the dataset options 
        const opacity = 0.1 + ((d.year - 2015) / (2026 - 2015)) * 0.85; //calculate opacity based on year, with 2015 being the lightest and 2026 being the darkest
        return {
          x: d.government_ai_spending,
          y: d.ai_adoption_enterprise,
          r: Math.pow(d.gdp_per_capita / 5500, 1.2), // make the size difference more obvious
          country: d.country,
          year: d.year,

          backgroundColor:`rgba(${baseColor}, ${opacity})`,
          borderColor: `rgba(${baseColor}, ${opacity + 0.2})`,
        };
      }),
      backgroundColor: context => context.raw?.backgroundColor,
      borderColor: context => context.raw?.borderColor,
      borderWidth: 1
      };
    });


  new Chart(
    ctx, 
    {
      type: 'bubble',
      data: {datasets},
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {color: 'white', size: 14},
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const d = context.raw;
                return `${d.country} (${d.year}): Spending ${d.x} billions, Adoption ${d.y}%`
              }
            }
          }
        },
        layout: {
          padding: {top: 20}
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Government AI Spending (USD)',
              font: {
                size: 16,
                color: 'white'
              }
              },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
                },
            },
            y: {
              title: {
                display: true,
                text: 'Enterprise AI Adoption (%)',
                font: {
                  size: 16,
                  color: 'white'
                }
                },
              grid: {
                  color: 'rgba(255, 255, 255, 0.2)'
                }
            }
          }
        }
      }
  );
}

loadAndChartData2()