<template>
  <q-card class="no-shadow" bordered>
    <q-card-section class="q-pa-none">
      <q-table
        square
        class="no-shadow"
        title="Users List"
        :rows="data"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :rows-per-page-options="[10]"
        @row-click="onRowClick"
      >
        <template v-slot:top-right>
          <q-input
            v-if="show_filter"
            filled
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
            @update:model-value="fetchData"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            class="q-ml-sm"
            icon="filter_list"
            @click="show_filter = !show_filter"
            flat
          />
        </template>
        <template v-slot:no-data>
          <div class="q-pa-md grid justify-center full-height">
            <div class="text-h6 text-grey-8" style="justify-self: center">
              No Data Available
            </div>
          </div>
        </template>
        <template v-slot:pagination>
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
            boundary-numbers
            :rows-per-page-options="[5, 10, 20, 50]"
            :input="true"
            @update:model-value="fetchData"
          />
        </template>
        <template v-slot:body-cell-Action="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.status"
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click.stop="onDelete(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <q-dialog v-model="userDetailsDialog">
      <q-card style="min-width: 600px" class="q-pb-md">
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h5">User Details</div>
          <div class="text-subtitle2">Insights and Overview</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="q-mb-md text-center">
            <q-img
              class="profile-img"
              :src="userDetails?.user.profilePic || fallbackImage"
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                cursor: pointer;
              "
              @click="openImage(userDetails?.user.profilePic)"
            >
              <template #error>
                <img
                  :src="fallbackImage"
                  alt="Fallback Image"
                  class="post-img"
                  style="border: none; width: 100%; height: 100%; padding: 4px"
                />
              </template>
            </q-img>
            <h4 class="q-my-sm">{{ userDetails.user.name }}</h4>
            <p v-if="userDetails.user.username" class="q-my-sm">
              @{{ userDetails.user.username }}
            </p>
            <q-chip
              :color="userDetails.user.status ? 'positive' : 'negative'"
              icon="check_circle"
              dense
            >
              {{ userDetails.user.status ? "Active" : "Inactive" }}
            </q-chip>
            <div class="flex justify-around q-mt-md">
              <div class="text-center">
                <p class="text-h6 text-weight-medium text-primary q-mb-xs">
                  {{ userDetails?.followersCount }}
                </p>
                <p>Followers</p>
              </div>
              <div class="text-center">
                <p class="text-h6 text-weight-medium text-primary q-mb-xs">
                  {{ userDetails?.followingCount }}
                </p>
                <p>Following</p>
              </div>
              <div class="text-center">
                <p class="text-h6 text-weight-medium text-primary q-mb-xs">
                  {{ userDetails?.likesCount }}
                </p>
                <p>Likes</p>
              </div>
            </div>
          </div>
          <div class="q-col-gutter-md">
            <q-input
              disable
              v-model="userDetails.user.name"
              outlined
              label="Name"
            />
            <q-input
              disable
              v-model="userDetails.user.email"
              outlined
              label="Email"
            />
            <q-input
              disable
              v-model="userDetails.user.dateOfBirth"
              label="Date of birth"
              outlined
              mask="date"
              :rules="['date']"
              style="padding-bottom: 0"
            >
            </q-input>
            <q-input
              disable
              v-model="userDetails.user.bio"
              type="text"
              outlined
              label="Bio"
            />
          </div>
        </q-card-section>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-button"
          @click="
            userDetailsDialog = false;
            userDetails = null;
          "
        />
      </q-card>
    </q-dialog>
  </q-card>
  <q-dialog v-model="imgDialog" @hide="imgDialog = false">
    <q-img
      :src="imageSrc"
      spinner-color="primary"
      spinner-size="22px"
    />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "src/stores/userStore";
import { useQuasar } from "quasar";
import fallbackImage from "src/assets/profile-user.png";
import { useRoute } from "vue-router";

const data = ref([]);
const loading = ref(false); // Loading state for the table
const filter = ref(""); // Search filter
const show_filter = ref(false);
const userStore = useUserStore();
const $q = useQuasar();
const userDetailsDialog = ref(false); // Dialog visibility
const userDetails = ref({}); // User details to display
const imgDialog = ref(false); // Control dialog visibility
const imageSrc = ref("");
const route = useRoute();

// Pagination state
const pagination = ref({
  page: 1, // Current page
  rowsPerPage: 10, // Records per page
  sortBy: "createdAt", // Default sort column
  descending: true, // Sort direction
});

// Columns for the table
const columns = [
  {
    name: "createdAt",
    label: "Created At",
    align: "center",
    field: (row) => row.createdAt,
    format: (val) => {
      const date = new Date(val);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }, // Formats date as MM/DD/YYYY
    sortable: false,
  },
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: (row) => row.email,
    format: (val) => `${val}`,
    sortable: false,
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: (row) => row.status,
    format: (val) => (val ? "Active" : "Inactive"), // Converts boolean to human-readable status
    sortable: false,
  },
  {
    name: "Action",
    label: "Action",
    field: "Action",
    sortable: false,
    align: "center",
  },
];

onMounted(async () => {
  filter.value = route?.query?.search || ""
  if (filter.value) show_filter.value = true;
  await fetchData();
});

const openImage = (src) => {
  imageSrc.value = src; // Set the image source
  imgDialog.value = true; // Open the dialog
};

const fetchData = async () => {
  try {
    loading.value = true;

    // Prepare API request parameters
    const params = {
      page: pagination.value.page, // Current page number
      limit: pagination.value.rowsPerPage, // Rows per page
      sortBy: pagination.value.sortBy, // Sorting column
      order: pagination.value.descending ? "desc" : "asc", // Sort direction
      search: filter.value.trim(), // Search filter (if provided)
    };

    // Fetch users from the API (assuming userStore.getUserList exists)
    const response = await userStore.getUserList(params);

    // Update table data and total rows
    data.value = response?.users; // Update rows
    pagination.value.rowsNumber = response?.pagination?.totalUsers; // Total number of rows
  } catch (error) {
    $q.notify({
      message:
        error?.message || "Failed to fetch users list. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    loading.value = false; // Stop loading state
  }
};

const fetchUserDetails = async (id) => {
  try {
    loading.value = true;

    // Fetch users from the API (assuming userStore.getUserList exists)
    const response = await userStore.getUserDetails(id);
    userDetailsDialog.value = true;
    userDetails.value = response;
  } catch (error) {
    $q.notify({
      message:
        error?.message ||
        "Failed to fetch user details. Please try again later.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    loading.value = false; // Stop loading state
  }
};

const onRowClick = async (evt, row) => {
  await fetchUserDetails(row.id);
};

const onDelete = async (row) => {
  try {
    $q.dialog({
      title: "Confirm",
      message: `Are you sure you want to delete the user ${row.name}?`,
      ok: { label: "Yes", color: "red" },
      cancel: { label: "No", color: "grey" },
    })
      .onOk(async () => {
        // User confirmed
        loading.value = true;

        // Call your delete API
        await userStore.deleteUser(row.id);

        // Notify success
        $q.notify({
          message: "User deleted successfully.",
          color: "positive",
          position: "top",
        });

        // Refresh data after deletion
        await fetchData();
      })
      .onCancel(() => {
        // User canceled
        console.log("Delete action canceled.");
      })
      .onDismiss(() => {
        // Dialog dismissed
        console.log("Dialog dismissed.");
      });
  } catch (error) {
    $q.notify({
      message: error?.message || "Failed to delete user.",
      color: "negative",
      position: "top",
      timeout: 3000,
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.q-table__bottom) {
  display: grid;
  grid-auto-flow: column;
}
:deep(.q-pagination .q-btn) {
  color: black !important; /* Make text black */
}
:deep(.q-pagination .q-btn:disabled) {
  color: gray !important; /* Slightly lighter color for disabled buttons */
}
.profile-img {
  flex-shrink: 0;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #000;
}
:deep(.q-field__bottom) {
  display: none;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
