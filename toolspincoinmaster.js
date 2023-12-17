/* eslint-disable @typescript-eslint/no-unused-vars */

// Các thư viện cần thiết
import { writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import { post } from 'axios';

// Link dẫn đến các tệp data
const dataLink = 'datacoinmaster.json';
// link dẫn đến coin and spin
const coins = response.data.coins;
const spins = response.data.spins;

// Đường dẫn đến tệp Appstate
let appStatePath = 'appstate.json';

// Hàm đăng nhập bằng tài khoản Facebook
async function login(email, password) {
  try {
    // Gửi yêu cầu đăng nhập
    const response = await post('https://api.coinmastergame.com/v2/account/login', {
      email: email,
      password: password
    });

    // Lưu thông tin đăng nhập vào tệp appstate.json
    writeFileSync(appStatePath, JSON.stringify(response.data.appState));

    console.log('Đăng nhập thành công');
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
  }
}

// Hàm đăng xuất
function logout() {
  try {
    // Xóa tệp appstate.json để đăng xuất
    unlinkSync(appStatePath);

    console.log('Đăng xuất thành công');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
  }
}

// Hàm chạy spin
async function runSpin(spins) {
  try {
    // Đọc dữ liệu từ tệp datacoinmaster.json
    const data = JSON.parse(readFileSync(dataLink));

    // Đọc tệp appstate.json
    const appState = JSON.parse(readFileSync(appStatePath));

    // Gửi yêu cầu chạy spin
    for (let i = 0; i < spins; i++) {
      const response = await post('https://api.coinmastergame.com/v1/spins', {
        bet: data.bet,
        spins: 1
      }, {
        headers: {
          'Authorization': 'Bearer ' + appState.accessToken
        }
      });

      console.log('Spin:', i + 1, ' - Coin:', response.data.coin);
    }
  } catch (error) {
    console.error('Lỗi chạy spin:', error);
  }
}

// Hàm xử lý tăng coin và spin
async function increaseCoinAndSpin(email, password, spins) {
  // Thiết lập đường dẫn tới tệp appstate.json
  appStatePath = 'appstate.json';

  // Nếu không tồn tại tệp appstate.json, đăng nhập và tạo mới tệp
  if (!existsSync(appStatePath)) {
    await login(email, password);
  }

  // Chạy spin
  await runSpin(spins);

  // Đăng xuất sau khi hoàn thành
  logout();
}

// Gọi hàm để tăng coin và spin
increaseCoinAndSpin('email@example.com', 'password123', 5);

