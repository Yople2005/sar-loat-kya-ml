import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const STRESS_MESSAGES = [
  "စာမေးပွဲနီးလာပြီ! 😱",
  "အချိန်က လျင်မြန်လိုက်တာ! ⏰",
  "ပြင်ဆင်ပြီးပြီလား? 📚",
  "အိပ်ချိန်တောင် မရှိတော့ဘူး! 😴",
  "စာအုပ်တွေ ဖွင့်လိုက်တော့! 📖",
];

const FAKE_MOTI_MESSAGES = [
  "အိပ်ရင်း စာကျက်လို့ရတယ် သိလား? 🛏️",
  "မနက်ဖြန် စကျက်ရင် အဆင်ပြေပါသေးတယ် 🌅",
  "စာမကျက်ချင်ရင် အိပ်ပြီးလူသားဆန်ပလိုက် 🛏️",
  "ဘဝက တိုတောင်းပါတယ်... စာကျက်ပြီးကုန်ဆုံးနေရတာ နှမြောစရာမကောင်းဘူးလား  😩",
  "မောင်/မမ ရေ... စာကျက်ပါဦး... အချိန်က ငါတို့ကို မစောင့်ဘူး ⏳",
  "စာမကျက်ရင် ဘာဖြစ်မလဲ သိလား? ... ခွေးဖြစ်မှာ\" 🤔",
  "အားမငယ်ပါနဲ့... ဒီထက်ဆိုးတဲ့သူတွေ အများကြီးရှိသေးတယ် 😅",
  "မျက်လုံးမှိတ်ပြီး စာအုပ်ကို ၅မိနစ် ထိထားရင် စာရတယ်တဲ့ စမ်းကြည့်... 📚",
  "ကြိုးစားပါ... ဒါပေမယ့် သိပ်တော့ မမျှော်လင့်ပါနဲ့ 🎭",
  "one subject one night လောက် ဘယ်ဟာမှအရသာမရှိဘူး ⚡️",
  "စာကျက်ရင်း အိပ်ငိုက်နေလား... ကောင်းတယ် အိပ်လိုက် 😴",
  "မီးပျက်သွားရင် ဘယ်လိုကျက်မလဲ... အဲ့တော့ ခုကျက်ထား 💡",
  "ဒီနေ့ မကျက်ရင် မနက်ဖြန်ကျက်လို့ရတယ်... ဒါပေမယ့် မနက်ဖြန်လည်း ဒီလိုပဲ ပြောမှာ 🎭",
  "စာကျက်ချင်စိတ် မရှိတာ ပုံမှန်ပါ... ပြဿနာက စာမေးပွဲက ပုံမှန်မဟုတ်ဘူး 📝",
  "တစ်ပုဒ်ကျက်ပြီးတိုင်း Facebook ကြည့်တာ မှားတယ်... Tiktok လည်း ကြည့်ပါ 📱",
  "အချိန်ရှိတုန်း အိပ်ထားလိုက်... နောက်ကျရင် အိပ်ချိန်တောင် မရတော့ဘူး 😪",
  "ဘာမှ မလုပ်ဘဲ အချိန်ဖြုန်းနေတာ အကောင်းဆုံးပဲ... စာကျက်ရင် ပိုဆိုးသွားမယ် 🎮",
  "မျှော်လင့်ချက် မပျောက်ပါစေနဲ့... ဒါပေမယ့် သိပ်လည်း မမျှော်လင့်ပါနဲ့ 🌈",
  "စာကျက်ရင်း ငိုချင်လာရင် ငိုလိုက်... စာမေးပွဲခန်းထဲလည်း ထပ်ငိုရမှာပဲ 😢",
  "ကိုယ့်ကိုယ်ကို ယုံကြည်မှု ရှိပါစေ... ဒါပေမယ့် အရမ်းတော့ မယုံလိုက်ပါနဲ့ 🤞",
  "မောပန်းလာရင် အနားယူပါ... ဒါပေမယ့် တစ်ရက်လုံး အနားယူနေတာတော့ မဟုတ်ဘူးနော် 🛋️",
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [previousTimeLeft, setPreviousTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [stressIndex, setStressIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showMoti, setShowMoti] = useState(false);
  const [motiMessage, setMotiMessage] = useState("");
  const [motiTimer, setMotiTimer] = useState<NodeJS.Timeout | null>(null);

  const getRandomMoti = () => {
    // Clear existing timer if any
    if (motiTimer) {
      clearTimeout(motiTimer);
    }

    // Get a random message different from the current one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * FAKE_MOTI_MESSAGES.length);
    } while (FAKE_MOTI_MESSAGES[randomIndex] === motiMessage && FAKE_MOTI_MESSAGES.length > 1);

    setMotiMessage(FAKE_MOTI_MESSAGES[randomIndex]);
    setShowMoti(true);

    // Set new timer
    const timer = setTimeout(() => setShowMoti(false), 5000);
    setMotiTimer(timer);
  };

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (motiTimer) {
        clearTimeout(motiTimer);
      }
    };
  }, [motiTimer]);

  useEffect(() => {
    const targetDate = new Date("2025-03-24T00:00:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setPreviousTimeLeft(timeLeft);
        setTimeLeft({ days, hours, minutes, seconds });

        // Show warning for specific conditions
        if (days < 100 || (days === 0 && hours < 12)) {
          setShowWarning(true);
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Rotate stress messages
    const messageTimer = setInterval(() => {
      setStressIndex((prev) => (prev + 1) % STRESS_MESSAGES.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [timeLeft]);

  const TimeUnit = ({ value, label, shouldAnimate }: { value: number; label: string; shouldAnimate: boolean }) => (
    <div className={`glass-morphism flex flex-col items-center p-6 rounded-[2rem] transition-all hover:scale-105 ${showWarning ? 'animate-pulse-red' : ''}`}>
      <span 
        className={`text-4xl md:text-7xl font-bold text-white ${
          shouldAnimate ? "animate-number-change" : ""
        }`}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-sm md:text-lg text-white/90 mt-2 font-medium">
        {label}
      </span>
    </div>
  );

  const getStressLevel = () => {
    const { days } = timeLeft;
    if (days > 100) return "နေးသေးတယ်... 😌";
    if (days > 50) return "စလုပ်ဖို့ အချိန်တန်ပြီ! 😅";
    if (days > 30) return "ကဲ စာလုပ်ကြမယ်! 😰";
    if (days > 10) return "အရမ်းနည်းနေပြီ! 😱";
    return "ဘုရား... ဘုရား... 😭";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-16">
          <span className={`inline-block px-6 py-3 glass-morphism text-white rounded-full text-lg font-medium mb-6 ${showWarning ? 'animate-pulse-red' : ''}`}>
            {STRESS_MESSAGES[stressIndex]}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            စာမေးပွဲအတွက် ကျန်ရှိချိန်
          </h1>
          <p className="text-white/90 text-xl max-w-2xl mx-auto mb-4">
            {getStressLevel()}
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            သင်ခွေးဖြစ်မဖြစ်က ဒီအချိန်တွေပေါ် မူတည်နေပါတယ်! 
          </p>
          
          <button 
            onClick={getRandomMoti}
            className="mt-8 glass-morphism px-6 py-3 rounded-full text-white hover:scale-105 transition-transform active:scale-95"
          >
            🎯 Motivation ရယူမယ်
          </button>
          
          {showMoti && (
            <div className="mt-6 animate-fade-in">
              <p className="glass-morphism inline-block px-6 py-3 text-white text-lg rounded-full animate-bounce">
                {motiMessage}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <TimeUnit 
            value={timeLeft.days} 
            label="ရက်" 
            shouldAnimate={timeLeft.days !== previousTimeLeft.days}
          />
          <TimeUnit 
            value={timeLeft.hours} 
            label="နာရီ" 
            shouldAnimate={timeLeft.hours !== previousTimeLeft.hours}
          />
          <TimeUnit 
            value={timeLeft.minutes} 
            label="မိနစ်" 
            shouldAnimate={timeLeft.minutes !== previousTimeLeft.minutes}
          />
          <TimeUnit 
            value={timeLeft.seconds} 
            label="စက္ကန့်" 
            shouldAnimate={timeLeft.seconds !== previousTimeLeft.seconds}
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/90 text-lg font-medium glass-morphism inline-block px-6 py-3 rounded-full">
            စာမေးပွဲနေ့: ၂၀၂၅ မတ်လ ၂၄ ရက်
          </p>
          {showWarning && (
            <p className="text-white/90 text-lg mt-6 animate-pulse">
              ⚠️ သတိပေးချက်: အချိန်အရမ်းနည်းနေပါပြီ! ⚠️
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
