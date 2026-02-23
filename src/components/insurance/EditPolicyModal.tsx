"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PolicyData } from "@/lib/insurance/types";
import { updatePolicyVitals } from "@/app/insurance/actions"; // Server action
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts, checking imports

interface EditPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyData: PolicyData;
    analysisId: string;
}

export function EditPolicyModal({ isOpen, onClose, policyData, analysisId }: EditPolicyModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        registrationNo: policyData.vehicleInfo.registrationNo || "",
        make: policyData.vehicleInfo.make || "",
        model: policyData.vehicleInfo.model || "",
        insurerName: policyData.insurerName || "",
        idv: policyData.idv || 0,
        premium: policyData.premium || 0,
        policyNumber: policyData.policyNumber || "",
        expiryDate: policyData.expiryDate || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "idv" || name === "premium" ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await updatePolicyVitals(analysisId, formData);

            if (result.success) {
                toast.success("Policy updated successfully");
                onClose();
            } else {
                toast.error("Failed to update policy");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Policy Details</DialogTitle>
                    <DialogDescription>
                        Make changes to your policy details here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="registrationNo">Registration No.</Label>
                                <Input
                                    id="registrationNo"
                                    name="registrationNo"
                                    value={formData.registrationNo}
                                    onChange={handleChange}
                                    placeholder="MH01AB1234"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="policyNumber">Policy Number</Label>
                                <Input
                                    id="policyNumber"
                                    name="policyNumber"
                                    value={formData.policyNumber}
                                    onChange={handleChange}
                                    placeholder="P-12345678"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="make">Make</Label>
                                <Input
                                    id="make"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    placeholder="Toyota"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="Fortuner"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="insurerName">Insurer Name</Label>
                            <Input
                                id="insurerName"
                                name="insurerName"
                                value={formData.insurerName}
                                onChange={handleChange}
                                placeholder="HDFC Ergo"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="idv">IDV (₹)</Label>
                                <Input
                                    id="idv"
                                    name="idv"
                                    type="number"
                                    value={formData.idv}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="premium">Premium (₹)</Label>
                                <Input
                                    id="premium"
                                    name="premium"
                                    type="number"
                                    value={formData.premium}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
