
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploadForm from "@/components/admin/images/ImageUploadForm";
import ImageList from "@/components/admin/images/ImageList";
import DefaultAnnouncementUpload from "@/components/admin/images/DefaultAnnouncementUpload";
import { Image, Upload, Settings } from "lucide-react";

const AdminImages = () => {
  return (
    <AdminRouteGuard>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Image Management</h1>
            <p className="text-gray-600">
              Upload and manage images for your website, including the default announcement banner.
            </p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Images
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Manage Images
              </TabsTrigger>
              <TabsTrigger value="defaults" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Default Images
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <ImageUploadForm />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <ImageList />
            </TabsContent>

            <TabsContent value="defaults" className="mt-6">
              <div className="space-y-6">
                <DefaultAnnouncementUpload />
                <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                  <strong>How it works:</strong> Once you upload a default announcement banner here, 
                  all future announcements created from emails will automatically use this image. 
                  This ensures consistent branding across all community announcements without manual intervention.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </AdminRouteGuard>
  );
};

export default AdminImages;
