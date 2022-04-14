export const group_KorToEng = (kor) => {
    if(kor === "은빛장년회") return "Senior";
    else if(kor === "봉사회") return "Father";
    else if(kor === "어머니회") return "Mother";
    else if(kor === "청년회") return "Young Adult";
    else if(kor === "중고등부") return "Youth Group";
    else if(kor === "초등부") return "Elementary";
    else if(kor === "유치부") return "Kindergarden";
    else if(kor === "영유아부") return "Baby";
    else if(kor === "전도인") return "Pastor";
    else return "";
}

export const sleepingArea_KorToEng = (kor) => {
    if(kor === "호텔") return "Hotel";
    else if(kor === "텐트") return "Tent";
    else if(kor === "차량") return "Car";
    else if(kor === "베데스다") return "Bethesda";
    else if(kor === "소망관 1층") return "Hope Hall 1st";
    else if(kor === "소망관 2층") return "Hope Hall 2nd";
    else if(kor === "유아방") return "Nursery Room";
    else if(kor === "디모데관") return "Timothy Hall";
    else if(kor === "요셉관") return "Joseph Hall";
    else if(kor === "사무엘관 1층") return "Samuel Hall 1st";
    else if(kor === "사무엘관 2층") return "Samuel Hall 2nd";
    else if(kor === "엘리야관") return "Elijah Hall";
    else if(kor === "엘리사관") return "Elisha Hall";
    else if(kor === "사랑관") return "Charity Hall";
    else if(kor === "은혜관") return "Grace Hall";
    else if(kor === "빌라델비아관") return "Philadelpia Hall";
    else if(kor === "아틀란타 캐빈") return "ATL Cabin";
    else if(kor === "시카고 모빌홈") return "Chicago Mobile Home";
    else if(kor === "뉴저지 캐빈") return "NJ Cabin";
    else if(kor === "워싱턴 캐빈") return "Washington Cabin";
    else if(kor === "워싱턴 모빌홈") return "Washington Mobile Home";
    else if(kor === "주방숙소") return "Kitchen Area";
    else if(kor === "캐빈 1") return "Cabin 1";
    else if(kor === "캐빈 2") return "Cabin 2";
    else if(kor === "캐빈 3") return "Cabin 3";
    else if(kor === "캐빈 4") return "Cabin 4";
    else if(kor === "캐빈 5") return "Cabin 5";
    else if(kor === "캐빈 6") return "Cabin 6";
    else return kor;
}

export const numberFormat = (value) =>{
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'USD',
    }).format(value)
}