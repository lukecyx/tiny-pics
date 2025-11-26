"use server";

export async function uploadFile(formData: FormData) {
  // TODO: create some sort of helper to handle env
  fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  });

  return;
}
