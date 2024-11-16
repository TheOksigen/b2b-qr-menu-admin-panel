import { cachedAuth } from "@/server/auth";
import { api } from "@/trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const client = await clerkClient();
  const user = await cachedAuth();

  const orgs = await client.users.getOrganizationMembershipList({
    userId: user.userId!,
  });

  const restaurants = await api.restaurant.getAll();

  async function createOrg(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    const restaurant = await api.restaurant.create({
      name,
    });

    console.log(restaurant);

    redirect("/");
  }

  async function deleteRestaurant(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;

    const restaurant = await api.restaurant.delete({ id });

    console.log(restaurant);

    redirect("/");
  }

  return (
    <div>
      {orgs.data.map((org, index) => (
        <div key={index}>
          {org.organization.id} - {org.organization.name} - {org.role}
        </div>
      ))}
      <br />
      <br />
      {restaurants.map((restaurant, index) => (
        <form action={deleteRestaurant}>
          <input type="hidden" name="id" value={restaurant.id} />
          <div key={index}>
            <span>
              {restaurant.id} - {restaurant.name} - {restaurant.organizationId}
            </span>
          </div>
          <button>Clickmyass</button>
        </form>
      ))}

      <form action={createOrg} className="border border-red-500">
        <input type="text" name="name" required />
      </form>
    </div>
  );
}
