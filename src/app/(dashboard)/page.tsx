'use client'

import { useState } from 'react'
import { api } from "@/trpc/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'

export default function DashboardPage() {
  const [newMenuName, setNewMenuName] = useState('')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('')
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const [newMenuDescription, setNewMenuDescription] = useState('')

  const { data: restaurants, refetch: refetchRestaurants } = api.restaurant.getAll.useQuery()

  const createMenuMutation = api.menu.createMenu.useMutation({
    onSuccess: () => {
      setNewMenuName('')
      refetchRestaurants()
      setIsCreateMenuOpen(false)
    },
  })

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestaurantId) return
    await createMenuMutation.mutateAsync({ title: newMenuName, restaurantId: selectedRestaurantId })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Menu Maker Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>  change to create restaurant
          <CardHeader>
            <CardTitle>Create New Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Menu
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Menu</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateMenu} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="restaurant-select" className="text-sm font-medium">Select Restaurant</label>
                    <select
                      id="restaurant-select"
                      value={selectedRestaurantId}
                      onChange={(e) => setSelectedRestaurantId(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select a restaurant</option>
                      {restaurants?.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="menu-name" className="text-sm font-medium">Menu Name</label>
                    <Input
                      id="menu-name"
                      value={newMenuName}
                      onChange={(e) => setNewMenuName(e.target.value)}
                      placeholder="Enter menu name"
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor="menu-descripton" className='text-sm font-medium'>Menu Descripton</label>
                    <Input
                      id="menu-description"
                      value={newMenuDescription}
                      onChange={(e) => setNewMenuDescription(e.target.value)}
                      placeholder="Enter menu description"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Create Menu</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurants?.length === 0 ? (
              <p className="text-muted-foreground">No restaurants found.</p>
            ) : (
              <ul className="space-y-2">
                {restaurants?.map((restaurant) => (
                  <li key={restaurant.id} className="flex items-center justify-between rounded-md bg-muted/60 p-3">
                    <span className="font-medium">{restaurant.name}</span>
                    {restaurant.activeMenu && (
                      <span className="text-sm text-muted-foreground">
                        Active Menu: {restaurant.activeMenu.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  )
}