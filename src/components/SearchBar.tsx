
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CDRSearchParams } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

interface SearchBarProps {
  onSearch: (params: CDRSearchParams) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  
  const form = useForm<CDRSearchParams>({
    defaultValues: {
      query: "",
      from_date: undefined,
      to_date: undefined,
      from_user: "",
      to_user: "",
      min_duration: undefined,
      max_duration: undefined,
      hangup_by: "",
      room: "",
    },
  });

  const handleSubmit = (data: CDRSearchParams) => {
    onSearch(data);
  };

  const handleSimpleSearch = () => {
    const query = form.getValues("query");
    onSearch({ query });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isAdvancedSearch) {
      handleSimpleSearch();
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-4">
          <div className="flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 pr-4 py-2 w-full"
                placeholder="Search call ID, users, room..."
                {...form.register("query")}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              type="button"
              onClick={handleSimpleSearch}
              className="ml-2 bg-blue-dark hover:bg-blue-900"
            >
              Search
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              variant="link"
              type="button"
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
              className="text-sm text-blue-dark"
            >
              {isAdvancedSearch ? "Hide Advanced Search" : "Advanced Search"}
            </Button>
          </div>

          {isAdvancedSearch && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="from_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>From Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="to_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>To Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date?.toISOString())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="from_user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From User</FormLabel>
                        <FormControl>
                          <Input placeholder="From user" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="to_user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To User</FormLabel>
                        <FormControl>
                          <Input placeholder="To user" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="min_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Minimum call duration"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Maximum call duration"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hangup_by"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hangup By</FormLabel>
                        <FormControl>
                          <Input placeholder="Hangup by user" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room</FormLabel>
                        <FormControl>
                          <Input placeholder="Room name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      onSearch({});
                    }}
                    className="mr-2"
                  >
                    Reset
                  </Button>
                  <Button type="submit" className="bg-blue-dark hover:bg-blue-900">
                    Apply Filters
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
