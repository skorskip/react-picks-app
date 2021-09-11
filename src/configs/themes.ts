export const themeList = [
  {
    name : "Light",
    value : "light",
    style: "light"
  },
  {
    name : "Dark",
    value: "dark",
    style: "dark"
  },
    {
        name : "Steelers",
        value : "steelers",
        style : "dark"
      },
      {
        name : "Giants",
        value : "giants",
        style : "dark"
      }, 
      {
        name : "Broncos",
        value : "broncos",
        style : "dark"
      }, 
      {
        name : "Green Bay",
        value : "green-bay",
        style : "dark"
      }, 
      {
        name : "Vikings",
        value : "vikings",
        style : "dark"
      },
      {
        name : "Saints",
        value : "saints",
        style : "dark"
      },
      {
        name : "Jets",
        value : "jets",
        style : "light"
      },
      {
        name : "Lions",
        value : "lions",
        style : "light"
      }, 
      {
        name : "49ers",
        value : "49er",
        style : "dark"
      },
      {
        name : "Football Team",
        value : "football-team",
        style : "dark"
      },
      {
        name : "Cowboys",
        value : "cowboys",
        style : "light"
      },
      {
        name : "Seahawks",
        value : "seahawks",
        style : "dark"
      },
      {
        name : "Wolverine",
        value : "wolverine",
        style : "dark",
      }
];

export const GetThemeInfo = (theme) => themeList.find(item => item.name === theme);