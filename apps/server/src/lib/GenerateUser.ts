const users = [
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-1.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-2.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-3.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-4.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-5.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-6.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-7.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-8.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-9.jpg" },
    { avatar: "https://s3.eu-north-1.amazonaws.com/bucket.kant/avatars/avatar-10.jpg" },
]

const names = [
    "John Doe", "Jane Smith", "Michael Johnson", "Emily Davis", "David Brown",
    "Sarah Wilson", "James Miller", "Olivia Taylor", "Daniel Anderson", "Sophia Thomas",
    "William Moore", "Isabella Jackson", "Alexander White", "Ava Harris", "Benjamin Martin",
    "Mia Thompson", "Christopher Garcia", "Charlotte Martinez", "Matthew Robinson", "Amelia Clark",
    "Andrew Rodriguez", "Abigail Lewis", "Ethan Lee", "Harper Walker", "Jacob Hall",
    "Evelyn Allen", "Logan Young", "Lily Hernandez", "Noah King", "Chloe Wright",
    "Lucas Lopez", "Ella Scott", "Jack Green", "Grace Adams", "Owen Baker",
    "Zoey Nelson", "Henry Hill", "Layla Carter", "Sebastian Mitchell", "Aria Perez",
    "Julian Roberts", "Nora Turner", "Leo Phillips", "Riley Campbell", "Nathan Parker",
    "Lillian Evans", "Aaron Edwards", "Hannah Collins", "Caleb Stewart", "Ellie Sanchez",
    "Isaac Morris", "Scarlett Rogers", "Ryan Reed", "Victoria Cook", "Dylan Morgan",
    "Penelope Bell", "Christian Murphy", "Zoe Bailey", "Elijah Rivera", "Lucy Cooper",
    "Gabriel Richardson", "Paisley Cox", "Anthony Howard", "Naomi Ward", "Charles Peterson",
    "Hazel Gray", "Thomas Hughes", "Aubrey Ramirez", "Joshua Price", "Stella James",
    "Lincoln Wood", "Savannah Bennett", "Adam Barnes", "Brooklyn Ross", "Nathaniel Henderson",
    "Kinsley Coleman", "Isaiah Jenkins", "Maya Perry", "Hunter Powell", "Skylar Long",
    "Dominic Patterson", "Elena Hughes", "Jonathan Flores", "Piper Washington", "Jeremiah Butler",
    "Aaliyah Simmons", "Adrian Foster", "Claire Bryant", "Brayden Alexander", "Camila Russell",
    "Jaxon Griffin", "Audrey Diaz", "Levi Hayes", "Anna Myers", "Jason Ford",
    "Caroline Hamilton", "Evan Graham", "Madelyn Sullivan", "Miles Wallace", "Sophie West"
];
export default class GenerateUser {

    static getRandomAvatar() {
        const position = Math.floor(Math.random() * users.length)
        return users[position].avatar
    }

    static getRandomName() {
        const position = Math.floor(Math.random() * names.length);
        return names[position];
    }
    
}