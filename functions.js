const usernameField = document.getElementsByClassName("username");
const avatarField = document.getElementsByClassName("avatar");
const fullnameField = document.getElementsByClassName("fullname");
const descriptionField = document.getElementsByClassName("description");
const topAvatar = document.getElementById("top-avatar");
const root = document.getElementById("root");
const loader = document.getElementById("loader");
const username = document.getElementById("username");
const dynamicUsername = document.getElementsByClassName("dynamic-username");
const dynamicFullname = document.getElementsByClassName("dynamic-fullname");
const dynamicAvatar = document.getElementsByClassName("dynamic-avatar");
const userDataPane = document.getElementById("user-data-pane");
const repositoryListBadge = document.getElementsByClassName("repository-list-badge");
const repositoriesField = document.getElementById("repositories");
const tabField = document.getElementsByClassName("tab");
const tabContentField = document.getElementsByClassName("tab-content");
const repositories = document.getElementById("repositories");

const TabFields = Array.from(tabField);
const loggedIn = false;
let description = "Frontend Developer and User Interface Designer";
const authphrase = "gang hutch pap _kil_ liff VinV 111 IcH cow qinq 137 jinj 555 666 enlarge InfinitI GanG bomb BlinK MatH rant PuP HulU dud hulu taint WanT XXX zzz GuN HutcH LooM loom anna 083 pap xxx zinc 752 876";
const getAuth = () => authphrase.match(/(\w)\b/g).join('');
const tabContentIndex = TabFields.findIndex((element , i) => element.classList.contains("active"));
  tabContentField[tabContentIndex]?.classList.add("show");


const toggleTopPane = () => {
  if(username.getBoundingClientRect().top <= 50 && !topAvatar.classList.contains("show")) {
    topAvatar.classList.add("show");
    userDataPane.classList.add("invisible");
  }
  if(username.getBoundingClientRect().top > 50 && topAvatar.classList.contains("show")) {
    topAvatar.classList.remove("show");
    userDataPane.classList.remove("invisible");
  }
}

const noRepositories = (text = "Failed to fetch Repositories") => {
  const div = document.createElement("div");
  div.classList.add("text-center", "m-auto")
  const h3 = document.createElement("h3");
      h3.classList.add("mt-24");
      h3.appendChild(
        document.createTextNode(text)
      )
      div.appendChild(h3);
      document.getElementById("repositories").append(
        div
      )
}

const toggleTabField = (field, index) => () => {
  if(field.classList.contains("active")) return; //click same item

  TabFields.forEach((element, i) => {
    element.classList.remove("active"); // remove previously active tab
    tabContentField[i]?.classList.remove("show"); // remove previously shown tab-content
  });
  field.classList.add("active"); //activate tab
  tabContentField[index]?.classList.add("show"); // activate corresponding tab content
};

const toggleMobileField = (field) => () => {
  field.classList.toggle("show-sm");
};

const formatTime = (date) => {

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const dateFormat = new Intl.DateTimeFormat('en', {month: 'short', day: "numeric", year: "numeric"});

  const timeDifference = new Date() - date;

  if (timeDifference < msPerMinute) {
       return Math.round(timeDifference/1000) + ' seconds ago';   
  }

  else if (timeDifference < msPerHour) {
       return Math.round(timeDifference/msPerMinute) + ' minutes ago';   
  }

  else if (timeDifference < msPerDay ) {
       return Math.round(timeDifference/msPerHour ) + ' hours ago';   
  }

  else if (timeDifference < msPerMonth) {
      return Math.round(timeDifference/msPerDay) + ' days ago';   
  }

  else {
      return 'on ' + dateFormat.format(new Date(date));
  }
}

const createSVG = (node, classes, DPath, role, ariaLabel) => {
const starSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const starPath = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'path'
);

starSvg.setAttribute("width", "16");
starSvg.setAttribute("height", "16");
starSvg.setAttribute('aria-hidden', 'true');
starSvg.setAttribute('viewBox', '0 0 16 16');
ariaLabel && starSvg.setAttribute('aria-label', ariaLabel);
role && starSvg.setAttribute('role', role);
starSvg.classList.add(...classes);

starPath.setAttribute(
  'd',
  DPath
);
starPath.setAttribute('fill-rule', 'evenodd');

starSvg.appendChild(starPath);
node.appendChild(starSvg);
}

const createAnchor = (node, classes, text = "", href ) => {
const anchor =  document.createElement("a");
const anchorTextContent = typeof text === "string" ? document.createTextNode(text) : text;

anchor.href = href || "#";
anchor.classList.add(...classes);

anchor.appendChild(anchorTextContent);
node.appendChild(anchor);
}

const FetchRepo = (user) => {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ getAuth()
    },
    body: JSON.stringify({
      query: `
          query getUserData${user ? "($login: String!)" : ""  } {
            ${user ? `user(login: $login)` : "viewer"  }{
              name
              avatarUrl
              email
              login
              updatedAt
              
              repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: OWNER) {
                nodes {
                  description
                  descriptionHTML
                  name
                  shortDescriptionHTML
                  description
                  isFork
                  forkCount
                  url
                  licenseInfo {
                    name
                  }
                  parent {
                    name
                    forkCount
                    nameWithOwner
                    url
                  }
                  primaryLanguage {
                    color
                    name
                  }
                  updatedAt
                  pushedAt
                }
              }
            }
          }          
        `,
        variables: user ? { login: user } : undefined
    }),
  })
}

const getData = (user) => {
  repositories.innerHTML= "";

  FetchRepo(user).then((res) => res.json())
    .then((result) => {
      loader.classList.add("d-none");
      root.classList.remove("d-none");

      let usernameData = "Data not found";
        let fullname = "Data not found";
        let avatar = "./assets/placeholder.png";
        let noOfRepos = 0;
      const data = result?.data?.viewer || result?.data?.user;

      if(data) {
        const { repositories, name, avatarUrl, login } = data;
  
        repositories?.nodes.forEach(({ name, parent, primaryLanguage, forkCount, pushedAt, url, isFork, licenseInfo, description }) => {
          RepositoryItem(
            document.getElementById("repositories"),
            name,
            isFork,
            parent?.url,
            parent?.nameWithOwner,
            description,
            primaryLanguage?.name,
            primaryLanguage?.color,
            forkCount + parent?.forkCount || 0,
            licenseInfo?.name,
            formatTime(new Date(pushedAt)),
            url
          );
        })
  
        usernameData = login;
        fullname = name;
        avatar = avatarUrl;
        noOfRepos = repositories && repositories.nodes ? repositories.nodes.length : 0;
      }

      if(user && !data) {
        description = "Data not found";
        noRepositories(`We couldn’t find any users matching 'user:${user}'`);
      }
        // Dynamic Variables
        const UsernameFields = user ? dynamicUsername : usernameField;
        const FullnameFields = user ? dynamicFullname : fullnameField;
        const AvatarFields = user ? dynamicAvatar : avatarField;
        Array.from(UsernameFields).forEach(element => {
          element.innerHTML = usernameData;
        });
        Array.from(FullnameFields).forEach(element => {
          element.innerHTML = fullname;
        });
        Array.from(AvatarFields).forEach(element => {
          element.src = avatar;
        });
        Array.from(descriptionField).forEach(element => {
          element.innerHTML = description;
        });
        
        repositoryListBadge[0].innerHTML = noOfRepos;
  
        let title = user ? `${usernameData} (${fullname}) ${loggedIn ? "" : "- Github"}` : "Your Repositories";
        title = usernameData ? title : "Github";
        if (document.title != title) {
          document.title = title;
        }



    })
    .catch((err) => {
      loader.classList.add("d-none");
      root.classList.remove("d-none");

      noRepositories();
    });
}

const getUser = (e) => {
  if (e.which === 13) {
    getData(e.target.value);
    e.target.value = "";
    e.target.blur();
  }
}