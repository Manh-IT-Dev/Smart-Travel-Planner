// --- SECURE METEOROLOGICAL LOCATIVE SMART-FALLBACK SANDBOX DATA ENGINE ---
export interface LandmarkItem {
  title: { vi: string; en: string };
  location: { vi: string; en: string };
  reason: { vi: string; en: string };
}

export const FALLBACK_LANDMARKS: Record<string, Record<string, LandmarkItem>> = {
  hanoi: {
    outdoor_nice: {
      title: { vi: "Đi bộ quanh Hồ Gươm & Đền Ngọc Sơn", en: "Stroll Hoan Kiem Lake & Ngoc Son Temple" },
      location: { vi: "Phố đi bộ Hoàn Kiếm, Hà Nội", en: "Hoan Kiem Walking Street, Hanoi" },
      reason: { vi: "Nắng nhẹ gió mát rất thích hợp dạo bộ ngắm cảnh hồ.", en: "Mild pleasant breeze and top visibility make this perfect for lake-side jogging." }
    },
    outdoor_rain: {
      title: { vi: "Tham quan Bảo tàng Mỹ thuật Việt Nam", en: "Visit Vietnam Museum of Fine Arts" },
      location: { vi: "66 Nguyễn Thái Học, Ba Đình, Hà Nội", en: "66 Nguyen Thai Hoc, Ba Dinh, Hanoi" },
      reason: { vi: "Không gian kiến trúc Pháp cổ kính trong nhà trưng bày mỹ thuật, tránh mưa lý tưởng.", en: "Historic indoor French galleries with rich art collections, perfect protection from the rain." }
    },
    indoor_nice: {
      title: { vi: "Check-in Nhà hát Lớn Hà Nội", en: "Tour Hanoi Opera House" },
      location: { vi: "1 Tràng Tiền, Hoàn Kiếm, Hà Nội", en: "1 Trang Tien, Hoan Kiem, Hanoi" },
      reason: { vi: "Thời tiết khô ráo, chụp ảnh kiến trúc Châu Âu tráng lệ cực kỳ đẹp mắt.", en: "Beautiful clear light shines beautifully on this French masterpiece, making photos spectacular." }
    },
    indoor_rain: {
      title: { vi: "Mua sắm tại Tràng Tiền Plaza", en: "Luxury Shopping at Trang Tien Plaza Mall" },
      location: { vi: "24 Hai Bà Trưng, Hoàn Kiếm, Hà Nội", en: "24 Hai Ba Trung, Hoan Kiem, Hanoi" },
      reason: { vi: "Trung tâm thương mại sang trọng trong nhà ấm áp, tránh mưa rào hiệu quả.", en: "Elite indoor complex featuring high-end boutiques and dry wellness centers away from raindrops." }
    },
    cafe_nice: {
      title: { vi: "Thưởng thức cà phê trứng tại Đằng / Đinh Café", en: "Enjoy Egg Coffee at Historic Dinh Café" },
      location: { vi: "13 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội", en: "13 Đinh Tiên Hoàng, Hoan Kiem, Hanoi" },
      reason: { vi: "Ngắm trọn vẹn cảnh Hồ Gươm thanh bình từ ban công thơ mộng.", en: "Sit on the legend balcony, tasting local coffee and viewing peaceful street flows." }
    },
    cafe_rain: {
      title: { vi: "Thưởng trà ấm ngắm Hồ Gươm tại Cộng Cà Phê Cầu Gỗ", en: "Warm Drink Watching Rain at Cong Caphe" },
      location: { vi: "116 Cầu Gỗ, Hàng Bạc, Hoàn Kiếm, Hà Nội", en: "116 Cau Go, Hang Bac, Hoan Kiem, Hanoi" },
      reason: { vi: "Không gian hoài niệm mộc mạc ngắm toàn cảnh mưa phủ mờ ảo trên hồ.", en: "Watch the mist and drops over Hoan Kiem Lake from inside a nostalgic, cozy coffee spot." }
    },
    sightseeing_nice: {
      title: { vi: "Khám phá Văn Miếu - Quốc Tử Giám", en: "Explore Temple of Literature Complex" },
      location: { vi: "58 Quốc Tử Giám, Đống Đa, Hà Nội", en: "58 Quoc Tu Giam, Dong Da, Hanoi" },
      reason: { vi: "Nắng xanh trong veo tôn lên cổng tam quan cổ kính và bia tiến sĩ xưa.", en: "Sunny clear sky showcases ancient imperial gardens and turtle steles beautifully." }
    },
    sightseeing_rain: {
      title: { vi: "Khám phá Hoàng Thành Thăng Long tránh mưa", en: "Discover Imperial Citadel Indoors Exhibits" },
      location: { vi: "19C Hoàng Diệu, Điện Biên, Ba Đình, Hà Nội", en: "19C Hoang Dieu, Dien Bien, Ba Dinh, Hanoi" },
      reason: { vi: "Triển lãm di vật dưới lòng đất và bảo tàng phòng không mái che an toàn.", en: "Fascinating subterranean historical rooms keeping you completely dry." }
    },
    sport_nice: {
      title: { vi: "Chạy bộ dạo bộ Đường Hàn Quốc Hồ Tây", en: "Cycle or Jog along West Lake Promenade" },
      location: { vi: "Đường Hàn Quốc, Tây Hồ, Hà Nội", en: "West Lake Road, Tay Ho District, Hanoi" },
      reason: { vi: "Gió mát rì rào thích hợp nâng cao thể chất lành mạnh.", en: "Excellent airy breezes and beautiful views, perfect fit for morning exercise." }
    },
    sport_rain: {
      title: { vi: "Rèn luyện thể thao tại Elite Fitness Xuân Diệu", en: "Recharge at Elite Fitness Center" },
      location: { vi: "51 Xuân Diệu, Tây Hồ, Hà Nội", en: "51 Xuan Dieu, Tay Ho District, Hanoi" },
      reason: { vi: "Phòng tập thể hình cao cấp trong nhà hoàn toàn, xông hơi sảng khoái.", en: "Keep active indoors with prime fitness classes and luxury heated pools." }
    }
  },
  saigon: {
    outdoor_nice: {
      title: { vi: "Đi bộ quanh Công viên Tao Đàn rợp bóng cây", en: "Breathe Fresh Air at Tao Dan Park" },
      location: { vi: "Trương Định, Bến Thành, Quận 1, Tp.HCM", en: "Truong Dinh, Ben Thanh, District 1, Ho Chi Minh" },
      reason: { vi: "Bầu không khí thoáng đãng, bóng râm mát lịm thích hợp thư giãn.", en: "Glorious shade and greenery, wonderful for light walking and outdoor stretches." }
    },
    outdoor_rain: {
      title: { vi: "Tham quan Dinh Độc Lập khu trưng bày trong nhà", en: "Visit Independence Palace Inside Tours" },
      location: { vi: "135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1, Tp.HCM", en: "135 Nam Ky Khoi Nghia, District 1, Ho Chi Minh" },
      reason: { vi: "Tìm hiểu lịch sử nước nhà trong hội trường rộng lớn mát mẻ chống mưa.", en: "Step back in history within majestic, weather-proof executive meeting halls." }
    },
    indoor_nice: {
      title: { vi: "Check-in Bưu điện Trung tâm Sài Gòn", en: "Visit Saigon Central Post Office" },
      location: { vi: "Công xã Paris, Bến Nghé, Quận 1, Tp.HCM", en: "Paris Square, Ben Nghe, District 1, Ho Chi Minh" },
      reason: { vi: "Nắng xiên rực rỡ chiếu sáng vòm mái bưu điện cổ kính Pháp tuyệt đẹp.", en: "Classic sunshine illuminates the iconic dome architecture wonderfully for photos." }
    },
    indoor_rain: {
      title: { vi: "Giải trí tinh tế tại Bảo tàng Chứng tích Chiến tranh", en: "Learn History at War Remnants Museum" },
      location: { vi: "28 Võ Văn Tần, Quận 3, Tp.HCM", en: "28 Vo Van Tan, District 3, Ho Chi Minh" },
      reason: { vi: "Không gian trưng bày lịch sử sâu sắc, ấm áp khô ráo.", en: "Deeply moving educational galleries in safe, sheltered indoor setups." }
    },
    cafe_nice: {
      title: { vi: "Nhâm nhi cà phê ngắm phố đi bộ Nguyễn Huệ", en: "Coffee Tasting at Sài Gòn Apartment No. 42" },
      location: { vi: "Chung cư 42 Nguyễn Huệ, Quận 1, Tp.HCM", en: "42 Nguyen Hue Apartments, District 1, Ho Chi Minh" },
      reason: { vi: "Ngắm thành phố năng động nhộn nhịp dưới ánh nắng sớm mai dịu nhẹ.", en: "Unique retro views of Saigon's busiest stroll street from beautiful high open platforms." }
    },
    cafe_rain: {
      title: { vi: "Hẹn hò tại L'Usine Lê Lợi yên bình tránh mưa", en: "Cozy Dining and Coffee at L'Usine Café" },
      location: { vi: "19 Lê Thánh Tôn, Quận 1, Tp.HCM", en: "19 Le Thánh Tôn, District 1, Ho Chi Minh" },
      reason: { vi: "Không gian nghệ thuật châu Âu đậm đà đồ uống nóng xua tan khí lạnh ngày mưa.", en: "Artisan chic Cafe oasis serving hot cocoa and brunch safe from the storm." }
    },
    sightseeing_nice: {
      title: { vi: "Ngắm cảnh tại Bến Bạch Đằng lộng gió", en: "Sightseeing Saigon Waterbus at Bach Dang" },
      location: { vi: "Tôn Đức Thắng, Quận 1, Tp.HCM", en: "Ton Duc Thang, District 1, Ho Chi Minh" },
      reason: { vi: "Tầm nhìn khoáng đạt ngắm sông Sài Gòn trôi thênh thang dưới trời quang.", en: "Stunning riverside panoramas and nice gentle breeze, ideal for riverboats." }
    },
    sightseeing_rain: {
      title: { vi: "Tham quan Bảo tàng Mỹ thuật Tp. Hồ Chí Minh", en: "Explore Ho Chi Minh Fine Arts Museum" },
      location: { vi: "97A Phó Đức Chính, Quận 1, Tp.HCM", en: "97A Pho Duc Chinh, District 1, Ho Chi Minh" },
      reason: { vi: "Cung điện cổ màu vàng kiến trúc Pháp rực rỡ lấn át tiết trời mưa rơi.", en: "Stunning yellow mansion with rain drumming on old glass panelling—exceptionally artistic." }
    },
    sport_nice: {
      title: { vi: "Chạy bộ sáng sớm quanh Công viên Gia Định", en: "Morning Jog at Gia Dinh Tree Park" },
      location: { vi: "Phường 9, Phú Nhuận, Tp.HCM", en: "Gia Dinh Park, Phu Nhuan, Ho Chi Minh" },
      reason: { vi: "Lá phổi xanh mát rượi thanh lọc cơ thể khởi đầu ngày mới năng lượng.", en: "Dense woodland shade provides refreshing pure air in pleasant temperate weather." }
    },
    sport_rain: {
      title: { vi: "Bôi lội thể thao trong nhà tại CLB Yết Kiêu", en: "Indoor Heated Pool & Workout at Yet Kieu" },
      location: { vi: "1 Nguyễn Thị Minh Khai, Quận 1, Tp.HCM", en: "1 Nguyen Thi Minh Khai, District 1, Ho Chi Minh" },
      reason: { vi: "Thể dục dưới làn nước điều nhiệt thoải mái không lo mưa giông ngoài trời.", en: "Heated lanes and gyms, staying dry and active regardless of downpours." }
    }
  },
  danang: {
    outdoor_nice: {
      title: { vi: "Dạo biển cát trắng Mỹ Khê thoáng đãng", en: "Relax on My Khe Golden Sand Beach" },
      location: { vi: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng", en: "Vo Nguyen Giap Road, My Khe Beach, Da Nang" },
      reason: { vi: "Nắng êm dịu, cát bay nhẹ, không khí biển sảng khoái cực tốt.", en: "Vast sapphire waters and mild sun, absolute top-tier conditions for sand-stretching." }
    },
    outdoor_rain: {
      title: { vi: "Hành hương Động Huyền Không chùa Ngũ Hành Sơn", en: "Stroll Marble Mountains Sheltered Caves" },
      location: { vi: "Huyền Trân Công Chúa, Ngũ Hành Sơn, Đà Nẵng", en: "Huyen Tran Cong Chua, Marble Mountains, Da Nang" },
      reason: { vi: "Ngắm giếng trời hang động thạch nhũ huyền bí, mưa rơi qua khe đá kỳ vĩ.", en: "Sensational cave structures with skyward light shafts, protected from heavy rain waves." }
    },
    indoor_nice: {
      title: { vi: "Chinh phục ngắm cảnh Cầu Rồng", en: "Check-in at Da Nang Dragon Bridge" },
      location: { vi: "Nguyễn Văn Linh, Hải Châu, Đà Nẵng", en: "Nguyen Van Linh, Hai Chau District, Da Nang" },
      reason: { vi: "Điều kiện khô ráo lộng gió ngắm sông Hàn chảy xiết lãng mạn.", en: "Breezy clear atmosphere, perfect to capture the fire-breathing metal Dragon structure." }
    },
    indoor_rain: {
      title: { vi: "Xem triển lãm nghệ thuật Chăm độc bản", en: "Visit Museum of Cham Sculpture" },
      location: { vi: "02 Đường 2/9, Hải Châu, Đà Nẵng", en: "02 2 Thang 9 Road, Hai Chau, Da Nang" },
      reason: { vi: "Kho tàng điêu khắc đá cổ kính mái hiên rộng mở che mưa cổ điển.", en: "Fascinating sandstone carvings under wide protective colonial arches." }
    },
    cafe_nice: {
      title: { vi: "Ghé Cộng Cà Phê Bạch Đằng bờ sông Hàn", en: "Sip Coconut Coffee at Cong Caphe Riverview" },
      location: { vi: "98 Bạch Đằng, Hải Châu, Đà Nẵng", en: "98 Bach Dang, River Han Promenade, Da Nang" },
      reason: { vi: "Gió mát thổi từ sông Hàn dịu mát kết hợp cốt dừa bùi ngậy.", en: "Wonderful scenic river breeze paired with local sweet coconut coffee treats." }
    },
    cafe_rain: {
      title: { vi: "Tìm về tuổi thơ mộc mạc tại Nam House Cafe", en: "Vintage Retreat at Nam House Retro Cafe" },
      location: { vi: "15/1 Lê Hồng Phong, Hải Châu, Đà Nẵng", en: "15/1 Le Hong Phong, Hai Chau, Da Nang" },
      reason: { vi: "Ngắm những món đồ xa xưa trong ánh đèn vàng lung linh sưởi ấm tâm hồn.", en: "Warm yellow lights and classic relics to escape wet winds cozy on rainy days." }
    },
    sightseeing_nice: {
      title: { vi: "Check-in Chùa Linh Ứng Bán Đảo Sơn Trà", en: "Visit Linh Ung Pagoda Sơn Trà" },
      location: { vi: "Bán đảo Sơn Trà, Thọ Quang, Sơn Trà, Đà Nẵng", en: "Son Tra Peninsula, Tho Quang, Son Tra, Da Nang" },
      reason: { vi: "Tầm nhìn không mây ngắm trọn vẹn vịnh biển Đà Nẵng xanh thẳm.", en: "Perfect sunny weather reveals panoramic sapphire sea views and the great Lady Buddha statue." }
    },
    sightseeing_rain: {
      title: { vi: "Đọc sách thư giãn tại Thư viện Tổng hợp Đà Nẵng", en: "Read books at Da Nang General Library" },
      location: { vi: "46 Bạch Đằng, Hải Châu, Đà Nẵng", en: "46 Bach Dang, Hai Chau, Da Nang" },
      reason: { vi: "Không gian đọc sách kính lớn ven sông Hàn lãng mạn, khô ráo.", en: "Peaceful river-facing modern spaces to reflect and browse quietly." }
    },
    sport_nice: {
      title: { vi: "Bơi lội ngâm mình bên bãi biển Phạm Văn Đồng", en: "Swim at Pham Van Dong Public Beach" },
      location: { vi: "Sơn Trà, Đà Nẵng", en: "Pham Van Dong Beach, Da Nang" },
      reason: { vi: "Nước ấm mát, điều kiện bơi an toàn vô cùng sảng khoái.", en: "Gentle warm surf and clear tides, magnificent for recreation." }
    },
    sport_rain: {
      title: { vi: "Tập luyện thể thao tại Dragon Fitness Đà Nẵng", en: "Maintain Energy at Dragon Fitness Mall" },
      location: { vi: "Tầng 2, Lotte Mart Đà Nẵng", en: "Level 2 Lotte Mart, Da Nang" },
      reason: { vi: "Tập luyện hăng say năng động, không chịu ảnh hưởng từ mưa bão.", en: "Get a perfect full weight and cardio session on clean temperature-controlled decks." }
    }
  },
  tokyo: {
    outdoor_nice: {
      title: { vi: "Tản bộ ngắm cảnh vườn quốc gia Shinjuku Gyoen", en: "Walk around Shinjuku Gyoen Royal Garden" },
      location: { vi: "Shinjuku-ku, Tokyo, Nhật Bản", en: "11 Naitomachi, Shinjuku City, Tokyo, Japan" },
      reason: { vi: "Cây cối xanh mướt lung linh hoàn hảo dưới vầng nắng dịu ôn hòa.", en: "Beautiful gardens and tea houses pristine in temperate clean atmosphere." }
    },
    outdoor_rain: {
      title: { vi: "Khám phá các dãy phố có mái che khu Asakusa Nakamise", en: "Stroll Asakusa Senso-ji Covered Arcades" },
      location: { vi: "2 Chome Asakusa, Taito City, Tokyo, Nhật Bản", en: "2-3-1 Asakusa, Taito, Tokyo, Japan" },
      reason: { vi: "Dãy mua sắm đồ lưu niệm truyền thống có mái vòm kính che mưa tuyệt hảo.", en: "Nostalgic market alley completely sheltered, so you stay warm buying treats." }
    },
    indoor_nice: {
      title: { vi: "Trải nghiệm thế giới số thu mây TeamLab Planets", en: "Immersive digital art at teamLab Planets" },
      location: { vi: "Toyosu, Koto City, Tokyo, Nhật Bản", en: "6-1-16 Toyosu, Koto-ku, Tokyo, Japan" },
      reason: { vi: "Trình diễn ánh sáng kỹ thuật số trong nhà rực rỡ, thích hợp mọi thời tiết.", en: "Mind-blowing interactive light rooms inside, highly comfortable under climate control." }
    },
    indoor_rain: {
      title: { vi: "Mua sắm & Trải nghiệm công nghệ Shibuya Scramble Square", en: "Indoor explore Shibuya Scramble Square Mall" },
      location: { vi: "Shibuya Station Complex, Tokyo, Nhật Bản", en: "2-24-12 Shibuya, Tokyo, Japan" },
      reason: { vi: "Tổ hợp thương mại đỉnh cao có hầm kết nối ga tàu khô ráo tránh mưa 100%.", en: "Towering indoor complex connected directly to subway tunnels, bypassing outdoor rain." }
    },
    cafe_nice: {
      title: { vi: "Thưởng thức cà phê Blue Bottle Kiyosumi Garden", en: "Cozy Garden Coffee at Blue Bottle Kiyosumi" },
      location: { vi: "Kiyosumi, Koto City, Tokyo, Nhật Bản", en: "1-4-8 Hirano, Koto, Tokyo, Japan" },
      reason: { vi: "Thư giãn nhấp từng ngụm cold brew ngọt dịu trong ánh sáng trời ấm áp.", en: "Fabulous industrial glass layout perfect for soaking up local sunny day elements." }
    },
    cafe_rain: {
      title: { vi: "Xông trà thơm tại Starbucks Reserve Roastery Nakameguro", en: "Sip Premium Roasts at Starbucks Reserve Roastery" },
      location: { vi: "Nakameguro, Meguro City, Tokyo, Nhật Bản", en: "2-19-23 Aobadai, Meguro, Tokyo, Japan" },
      reason: { vi: "Không gian sang trọng ngắm nước tuôn xuống dòng sông Meguro thanh khiết ngày mưa.", en: "Exquisite multi-story coffee palace with glass walls looking onto the cozy river." }
    }
  },
  general: {
    outdoor_nice: {
      title: { vi: "Tản bộ ngắm cảnh công viên trung tâm", en: "Walk around City Landmark Park" },
      location: { vi: "Khu vực trung tâm thành phố {city}", en: "Central Green District, {city}" },
      reason: { vi: "Nắng ấm ôn hòa lộng gió thích hợp tản bộ dạo ngoạn.", en: "Perfect sunny weather with mild breeze, wonderful for walking and sightseeing." }
    },
    outdoor_rain: {
      title: { vi: "Ghé thăm Bảo tàng Nghệ thuật & Lịch sử trong nhà", en: "Visit Historic City Art Museum Indoor" },
      location: { vi: "Khu liên hợp văn hóa {city}", en: "Museum District, {city}" },
      reason: { vi: "Khuôn viên trưng bày di vật yên tĩnh, ấm áp ráo mát tránh mưa ẩm.", en: "Spacious historical galleries keeping you fully dry and comfortable." }
    },
    indoor_nice: {
      title: { vi: "Khám phá Nhà hát lớn và biểu tượng trung tâm", en: "Discover Landmark Architectural Center" },
      location: { vi: "Quảng trường trung tâm {city}", en: "City Grand Plaza, {city}" },
      reason: { vi: "Cảnh sắc trời quang rực rỡ chiếu sáng biểu tượng thành phố lung linh.", en: "Beautiful clear daylight highlights the town heritage, glorious for photos." }
    },
    indoor_rain: {
      title: { vi: "Mua sắm & Ăn uống tại Đại trung tâm thương mại mái che", en: "Shop & Dine at Covered Grand Galleria" },
      location: { vi: "Đại lộ mua sắm {city}", en: "Central Commerce Mall, {city}" },
      reason: { vi: "Không gian phức hợp trong nhà náo nhiệt, tránh gió mưa thoải mái.", en: "Heated indoor shopping galleria, protecting you fully from any severe weather elements." }
    },
    cafe_nice: {
      title: { vi: "Thưởng thức cà phê đặc sản tại ban công ngắm phố", en: "Savor Artisan Craft Brew at Sidewalk Cafe" },
      location: { vi: "Phố cổ {city}", en: "Historic Alley, {city}" },
      reason: { vi: "Vừa thư thả dạo mát vừa thưởng thức trà nóng ngắm nhìn nhịp sống.", en: "Enjoy clear view and lovely sunny atmosphere out on the lively terrace." }
    },
    cafe_rain: {
      title: { vi: "Hẹn hò sưởi ấm tại phòng trà bánh trong nhà", en: "Enjoy Hot Tea & Desserts inside Cozy Diner" },
      location: { vi: "Góc phố trung tâm {city}", en: "Street Corner Cafe, {city}" },
      reason: { vi: "Hương vị trà ấm sưởi ấm tâm hồn, xua tan không khí nồm ẩm ngày mưa.", en: "Delightful hot bakery oven smells and warm coffee, escaping the damp elements." }
    },
    sightseeing_nice: {
      title: { vi: "Khám phá Quảng trường Thành phố & Cổ trấn", en: "Sightsee Historic Town & Main Square" },
      location: { vi: "Trung tâm du lịch {city}", en: "Historic Center, {city}" },
      reason: { vi: "Dạo ngắm các di sản cổ kính trong ánh nắng tuyệt hoành tráng.", en: "Clear dry morning sun showcases architectural textures perfectly." }
    },
    sightseeing_rain: {
      title: { vi: "Khám phá Nhà thờ Lớn cổ kính hoặc Giáo đường trong nhà", en: "Explore Sheltered Cathedral Galleries" },
      location: { vi: "Biểu tượng giáo đường {city}", en: "Sacred Cathedral Dome, {city}" },
      reason: { vi: "Kiến trúc tranh kính sắc sảo lung linh tôn nghiêm ấm áp khỏi hạt mưa rào.", en: "Splendid glass mosaics and peaceful dry chambers to seek cozy spiritual escape." }
    },
    sport_nice: {
      title: { vi: "Chạy bộ nâng cao thể chất tại Sân vận động mở", en: "Outdoor Jogging and Stretch Routines" },
      location: { vi: "Công viên thể thao {city}", en: "Sports Complex Park, {city}" },
      reason: { vi: "Điều kiện không khí cực kỳ trong lành sảng khoái.", en: "Crisp and airy climate, beautiful to test your physical limits outdoors." }
    },
    sport_rain: {
      title: { vi: "Tập luyện Yoga & GYM trong nhà", en: "Yoga Classes or Indoor Fitness Workouts" },
      location: { vi: "Khu trung tâm thể thao {city}", en: "Active Gymnasium, {city}" },
      reason: { vi: "Tập luyện khỏe khoắn trong môi trường ấm cúng tiện lợi tránh mưa ẩm.", en: "Comprehensive indoor setups mean you stay fully fit without checking rain forecasts." }
    }
  }
};

export function getFallbackItem(
  city: string,
  activity: string,
  isRain: boolean,
  lang: 'vi' | 'en'
) {
  const normCity = city.trim().toLowerCase();
  
  // Find key based on lookup or substring mapping
  let key = "general";
  if (normCity.includes("hanoi") || normCity.includes("hà nội")) key = "hanoi";
  else if (normCity.includes("ho chi minh") || normCity.includes("sài gòn") || normCity.includes("saigon")) key = "saigon";
  else if (normCity.includes("tokyo")) key = "tokyo";
  else if (normCity.includes("danang") || normCity.includes("đà nẵng")) key = "danang";
  else if (normCity.includes("paris")) key = "paris";

  const activityType = activity.toLowerCase();
  const subkey = `${activityType}_${isRain ? "rain" : "nice"}`;
  
  // Try retrieving landmark
  let landmark = FALLBACK_LANDMARKS[key]?.[subkey];
  if (!landmark) {
    // try cross fallback e.g. indoor_nice for shopping_nice
    if (activityType === 'shopping') {
      landmark = FALLBACK_LANDMARKS[key]?.[`indoor_${isRain ? "rain" : "nice"}`];
    } else if (activityType === 'sightseeing') {
      landmark = FALLBACK_LANDMARKS[key]?.[`outdoor_${isRain ? "rain" : "nice"}`];
    }
  }
  
  // If still missing, check in "general"
  if (!landmark) {
    landmark = FALLBACK_LANDMARKS["general"]?.[subkey] || FALLBACK_LANDMARKS["general"]?.[`outdoor_${isRain ? "rain" : "nice"}`];
  }

  // Fallback of fallbacks
  if (!landmark) {
    landmark = {
      title: { vi: `Tham quan du ngoạn ${city}`, en: `Leisure sightseeing in ${city}` },
      location: { vi: `Trung tâm thành phố ${city}`, en: `${city} City Center` },
      reason: { vi: "Địa điểm tối ưu hóa tuyệt đẹp phù hợp với thời tiết ngày hôm nay.", en: "Optimized city destination well suited to today's climate conditions." }
    };
  }

  const replaceCity = (str: string) => str.replace(/{city}/g, city);

  return {
    title: replaceCity(landmark.title[lang]),
    location: replaceCity(landmark.location[lang]),
    reason: replaceCity(landmark.reason[lang])
  };
}

export function generateLocalFallbackItinerary(
  coordinates: any,
  current: any,
  daily: any,
  preferences: any
): any {
  const language = preferences.language === "vi" ? "vi" : "en";
  const city = coordinates.name;
  const isRain = (current?.rain || 0) > 0 || (current?.showers || 0) > 0;
  
  // Decide activities to generate (we need exactly 4 time intervals for high fidelity)
  const slots = [
    { time: "08:30 - 10:30", actType: isRain ? "indoor" : "sightseeing" },
    { time: "11:30 - 13:00", actType: "cafe" },
    { time: "14:30 - 16:30", actType: isRain ? "indoor" : "outdoor" },
    { time: "18:00 - 20:30", actType: isRain ? "cafe" : "sightseeing" }
  ];

  // Adjust slots according to preferredActivities if provided
  const userActivities = preferences.preferredActivities || [];
  if (userActivities.length >= 2) {
    slots[0].actType = userActivities[0] || slots[0].actType;
    slots[2].actType = userActivities[1] || slots[2].actType;
    if (userActivities[2]) {
      slots[3].actType = userActivities[2];
    }
  }

  const items = slots.map((slot) => {
    const details = getFallbackItem(city, slot.actType, isRain, language);
    const queryTerm = `${details.location} ${city}`;
    const encodedQuery = encodeURIComponent(queryTerm);

    return {
      id: Math.random().toString(36).substring(2, 11),
      time: slot.time,
      title: details.title,
      description: language === "vi" 
        ? `Lịch trình trải nghiệm thoải mái tại ${details.location} được hiệu chỉnh tự động bảo đảm sức khỏe.` 
        : `An enjoyable visual experience at ${details.location} tuned perfectly to avoid hazardous outdoor constraints.`,
      location: details.location,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      activityType: slot.actType,
      reason: details.reason
    };
  });

  const summary = language === "vi"
    ? `Lịch trình dự phòng thông minh bảo đảm sức khỏe tại ${city}. Do thời tiết hôm nay ${isRain ? "có mưa ẩm rải rác" : "khô ráo thoáng đãng"}, hành trình được sắp xếp xen kẽ nghỉ ngơi hợp lý bằng phương tiện '${preferences.transportMode === "walking" ? "đi bộ dạo phố" : (preferences.transportMode || "tiện lợi")}'.`
    : `Custom meteorological fallback planner activated for ${city}. Considering the city is currently experiencing ${isRain ? "wet rain showers" : "pleasant climate conditions"}, we designed a balanced itinerary utilizing '${preferences.transportMode || "cars"}' with zero outdoor exposure during peak anomalies.`;

  return {
    id: Math.random().toString(36).substring(2, 11),
    date: daily[0]?.date || new Date().toISOString().split("T")[0],
    locationName: city,
    summary,
    items,
    transportMode: preferences.transportMode || "walking",
    suitabilityScore: isRain ? 84 : 95,
    generatedAt: new Date().toISOString(),
    _isFallback: true
  };
}

export function generateLocalFallbackAlerts(
  weatherData: any,
  preferences: any
): any {
  const language = preferences.language === "vi" ? "vi" : "en";
  const { current, daily } = weatherData;
  const isRain = (current?.rain || 0) > 0 || (current?.showers || 0) > 0;
  const temp = current?.temperature || 20;
  const uv = daily[0]?.uvIndexMax || 0;
  
  const alerts: any[] = [];
  
  if (isRain) {
    alerts.push({
      id: Math.random().toString(36).substring(2, 11),
      title: language === "vi" ? "☔ Hạn chế phơi sương ngày mưa" : "☔ Scatter Showers Precipitation",
      message: language === "vi" 
        ? `Lượng mưa ghi nhận rơi đều khoảng ${current.rain || 0.6}mm. Đừng quên mang ô dù cầm tay bảo đảm sức khỏe.`
        : `Current Precipitation around ${current.rain || 0.6}mm detected. We recommend carrying umbrellas and picking sheltered transport options.`,
      severity: "warning",
      type: "rain",
      timestamp: new Date().toISOString(),
      read: false
    });
  }
  
  if (uv >= 6) {
    alerts.push({
      id: Math.random().toString(36).substring(2, 11),
      title: language === "vi" ? "☀️ Chỉ số bức xạ UV cao cực đoan" : "☀️ Dangerous Ultraviolet Radiation",
      message: language === "vi"
        ? `Chỉ số UV chạm mức ${uv}/10 lúc trưa. Hãy bôi kem chống nắng bảo vệ da nhạy cảm khi di chuyển.`
        : `Peak UV index reaching high ${uv}/12 levels during midday. Ensure sunscreen is applied fully during outdoor routines.`,
      severity: "danger",
      type: "uv",
      timestamp: new Date().toISOString(),
      read: false
    });
  } else if (temp > 32) {
    alerts.push({
      id: Math.random().toString(36).substring(2, 11),
      title: language === "vi" ? "🥵 Nhiệt độ nắng nóng oi bức" : "🥵 Excessive Dry Heat Alert",
      message: language === "vi"
        ? `Thời tiết chạm mốc ${temp}°C oi bức. Hãy uống bổ sung nước mỏ thường xuyên tránh say nắng.`
        : `Scorching outdoor temperature at ${temp}°C. Hydrate frequently and prefer air-conditioned indoor rest periods.`,
      severity: "danger",
      type: "temperature",
      timestamp: new Date().toISOString(),
      read: false
    });
  } else if (temp < 15) {
    alerts.push({
      id: Math.random().toString(36).substring(2, 11),
      title: language === "vi" ? "❄️ Cảnh báo không khí se lạnh" : "❄️ Chilly Environmental Cold Warning",
      message: language === "vi"
        ? `Nhiệt độ xuống thấp còn ${temp}°C. Thêm áo khoác ấm lót dày để giữ ấm đường hô hấp.`
        : `Cozy chilling temperature around ${temp}°C recorded. Please dress in layers with warm insulated coats.`,
      severity: "info",
      type: "temperature",
      timestamp: new Date().toISOString(),
      read: false
    });
  }
  
  if (alerts.length === 0) {
    alerts.push({
      id: Math.random().toString(36).substring(2, 11),
      title: language === "vi" ? "✨ Điều kiện thời tiết tuyệt đẹp" : "✨ Splendid Weather Conditions",
      message: language === "vi"
        ? `Nhiệt độ lý tưởng ${temp}°C nắng nhẹ lộng gió. Hoàn hảo để trải nghiệm các hoạt động dã ngoại dạo chơi!`
        : `Excellent mild climate at ${temp}°C with clear blue skies. Extremely recommended for all local outdoor excursions!`,
      severity: "info",
      type: "nice_day",
      timestamp: new Date().toISOString(),
      read: false
    });
  }
  
  return { alerts };
}
