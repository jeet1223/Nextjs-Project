export async function adminUserList(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  fromDate?: string,
  toDate?: string
) {
  const token = sessionStorage.getItem("access_token");
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append("search", search);
  if (fromDate) params.append("from", fromDate);
  if (toDate) params.append("to", toDate);

  const res = await fetch(`/api/admin/userList?${params.toString()}`, {
    method: "GET",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch users");
  return data;
}


export async function adminCategoryList(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  fromDate?: string,
  toDate?: string
) {
  // This function should be called from a component that has access to AuthContext
  // and use fetchWithAuth instead of manual token handling
  throw new Error("Use fetchWithAuth from AuthContext instead");
}

export async function addCategoryApi(name: string, description: string) {
  const token = sessionStorage.getItem("access_token");
  const res = await fetch("/api/admin/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });

  const data = await res.json();
  console.log(data,"kkkkkkk")
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}


 export async function  handleSubmit(activePage:string,text:string) {
  const token = sessionStorage.getItem("access_token");
   const res = await fetch("/api/admin/cms", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: activePage, // about | terms | privacy
        html: text,
      }),
    });
  const data = await res.json();
  console.log(data,"kkkkkkk")
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;

  };


export async function adminItemList(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  fromDate?: string,
  toDate?: string
) {
  const token = sessionStorage.getItem("access_token");
  const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) params.append("search", search);
  if (fromDate) params.append("from", fromDate);
  if (toDate) params.append("to", toDate);

  const res = await fetch(`/api/admin/item?${params.toString()}`, {
    method: "GET",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch users");
  return data;
}

export async function addItemApi(formData: FormData) {
  const token = sessionStorage.getItem("access_token");
  const res = await fetch("/api/admin/item", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Add item failed");
  return data;
}


export async function updateItemApi(id: number, formData: FormData) {
  const token = sessionStorage.getItem("access_token");
  const res = await fetch(`/api/admin/item/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update item failed");
  return data;
}

export async function deleteItemApi(id: number) {
  const token = sessionStorage.getItem("access_token");
  const res = await fetch(`/api/admin/item/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete item failed");
  return data;
}


// users
export async function fetchAllProducts() {
  const token = sessionStorage.getItem("access_token");
  const res = await fetch("/api/users/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log(data, "kkkkkkk");

  if (!res.ok) {
    throw new Error(data.error || "Unauthorized");
  }

  return data;
}

export async function fetchbyIdProducts(id: number) {
  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("access_token")
      : null;

  const res = await fetch(`/api/users/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const json = await res.json();
  console.log(json, "API RESPONSE");

  if (!res.ok) {
    throw new Error(json.error || "Unauthorized");
  }

  // ✅ return only the product object
  return json.data;
}




