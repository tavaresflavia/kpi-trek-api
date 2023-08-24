module.exports =  [
    {
      id: 1,
      name: "Production Efficiency",
      description: "Measures the ratio of actual output to expected output in the production line.",
      target: 95,
      upper_limit: 98,
      lower_limit: 90,
      unit: "%",
      created_by: 1
    },
    {
      id: 2,
      name: "Defect Rate",
      description: "Tracks the percentage of defective products in a production batch.",
      target: 2,
      upper_limit: 4,
      lower_limit: 0,
      unit: "%",
      created_by: 1
    },
    {
      id: 3,
      name: "Machine Downtime",
      description: "Monitors the total time that production machines are non-operational.",
      target: 5,
      upper_limit: 8,
      lower_limit: 3,
      unit: "hours",
      created_by: 3
    },
    {
      id: 4,
      name: "Cycle Time",
      description: "Measures the average time it takes to complete a manufacturing process.",
      target: 60,
      upper_limit: 70,
      lower_limit: 50,
      unit: "minutes",
      created_by: 1
    },
    {
      id: 5,
      name: "Yield Rate",
      description: "Calculates the percentage of products that meet quality standards.",
      target: 98,
      upper_limit: 99,
      lower_limit: 95,
      unit: "%",
      created_by: 1
    },
    {
      id: 6,
      name: "On-Time Delivery",
      description: "Tracks the percentage of orders delivered on time to customers.",
      target: 95,
      upper_limit: 98,
      lower_limit: 90,
      unit: "%",
      created_by: 5
    },
    {
      id: 7,
      name: "Energy Efficiency",
      description: "Monitors energy consumption and efficiency in manufacturing processes.",
      target: 85,
      upper_limit: 90,
      lower_limit: 80,
      unit: "kWh",
      created_by: 4
    },
    {
      id: 8,
      name: "Waste Reduction",
      description: "Measures the reduction of waste in the manufacturing process.",
      target: 10,
      upper_limit: 15,
      lower_limit: 5,
      unit: "tons",
      created_by: 1
    }
]