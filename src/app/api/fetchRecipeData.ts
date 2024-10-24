export const fetchRecipeData = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_FOODRECIPE_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_FOODRECIPE_API_URL;

  if (!API_KEY || !API_URL) {
    throw new Error("API key 또는 url을 불러오지 못했습니다.");
  }

  const response = await fetch(`${API_URL}/api/${API_KEY}/COOKRCP01/json/1/10`, {
    method: "GET"
  });

  if (!response.ok) {
    throw new Error("데이터를 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  // console.log("데이터 불러오기 성공 / data 확인", data);
  // console.log("데이터 불러오기 성공 / 조리법 확인", data.COOKRCP01.row);
  return data;
};
